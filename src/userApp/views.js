import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import path, { join } from "path";
import { RefreshToken } from "../config/models.js";
import {
  responseHandler as resHandler,
  responseHandler,
} from "../config/utils.js";
import { renderEmail } from "./email.js";
import { resetTokenModel, userModel as User } from "./models.js";
import { clearCookie, sendEmail } from "./utils.js";
const __dirname = path.resolve();
dotenv.config();

const loginView = async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email }).exec();
  let userInfo = {
    email: user.email,
    roles: user.roles,
    _id: user._id,
    image: user.image,
    name: user.firstName,
  };
  const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h",
  });
  let refreshToken = await RefreshToken.createToken(user);
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 60 * 24 * 7,
  });
  userInfo["token"] = accessToken;
  return resHandler(res, "success", 200, userInfo);
};

const createUserView = async (req, res, next) => {
  const isTaken = await User.findOne({ email: req.body.email });
  if (isTaken) return resHandler(res, "fail", 409, "Email is taken");
  let data = req.body;
  if (req.file && req.file.path !== undefined) {
    data["image"] = req.file.path;
    data["imageID"] = req.file.public_id;
  }
  const result = await User.create(data);
  const { password, ...others } = result._doc;
  return resHandler(res, "success", 201, {
    message: "Login is required to access protected resources",
    user: others,
  });
};

const updateUserView = async (req, res, next) => {
  if (!req.userId === req.params.id)
    return resHandler(res, "fail", 403, "Forbiden access");
  const data = req.body;
  if (data["password"]) {
    delete data["password"];
  }
  if (req.file && req.file.path !== undefined) {
    data["image"] = req.file.path;
    data["imageID"] = req.file.public_id;
  }
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  const { password, ...others } = updatedUser._doc;
  return resHandler(res, "success", 200, others);
};

const deleteUserView = async (req, res, next) => {
  if (!req.userId === req.params.id)
    return resHandler(res, "fail", 403, "Forbiden access");
  let { password } = req.body;
  if (!password)
    return resHandler(res, "fail", 400, {
      password: "Password is required",
    });

  const user = await User.findById(req.params.id);
  if (!user)
    return resHandler(res, "fail", 404, "Requested resource can not be found");

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return resHandler(res, "fail", 400, { message: "Invalid credentials" });
  }

  const deleteUser = await user.delete();
  return clearCookie(res);
};

const getUserView = async (req, res, next) => {
  if (!req.userId === req.params.id)
    return resHandler(res, "fail", 403, "Forbiden access");

  const user = await User.findById(req.params.id);
  if (!user) {
    return resHandler(
      res,
      "fail",
      404,
      "The requested resource can not be found"
    );
  }
  let { password, ...userInfo } = user._doc;

  return resHandler(res, "success", 200, userInfo);
};

const refreshTokenView = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies || !cookies.jwt)
    return resHandler(
      res,
      "fail",
      401,
      "A valid jwt cookie missing. Login first"
    );

  const refreshToken = cookies.jwt;
  const userToken = await RefreshToken.findOne({
    token: refreshToken,
  }).populate("user");
  if (!userToken) {
    return resHandler(res, "fail", 403, "Refresh token is not in the database");
  }

  if (RefreshToken.verifyExpiration(userToken)) {
    await RefreshToken.findByIdAndDelete(userToken._id).exec();
    res.clearCookie("jwt", { httpOnly: true });
    return resHandler(
      res,
      "fail",
      403,
      "Refresh token expired. Log in is required"
    );
  }
  const accessToken = jwt.sign(
    {
      email: userToken.user.email,
      _id: userToken.user._id,
      roles: userToken.user.roles,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "24h" }
  );

  return resHandler(res, "success", 200, { token: accessToken });
};

const logoutWithToken = async (res, accessToken) => {
  let token = accessToken.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) return resHandler(res, "success", 200, "Logout successful");

    const refreshtoken = await RefreshToken.findByIdAndDelete(decoded._id);
    if (!refreshtoken) console.log("Deleted from token");
    return resHandler(res, "success", 200, "Log out successful");
  });
};

const logoutView = async (req, res, next) => {
  const cookies = req.cookies;
  const accessToken = req.headers["authorization"];
  if (!cookies.jwt && !accessToken)
    return resHandler(res, "success", 200, "Log out successful");

  if (cookies.jwt) {
    const refreshToken = cookies.jwt;
    const userToken = await RefreshToken.findOneAndDelete({
      token: refreshToken,
    }).exec();
    if (!userToken || !accessToken)
      return resHandler(res, "success", 200, "Log out successful");

    return clearCookie(res);
  }

  return logoutWithToken(res, accessToken);
};

export const passwordReset = async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (!user)
    return resHandler(res, "fail", 400, { message: "The user does not exist" });
  let tokenObject = await resetTokenModel.findOne({ user: user._id });
  let token;
  if (!tokenObject) {
    token = await resetTokenModel.createToken(user._id);
  } else {
    const validToken = await tokenObject.checkValid();
    if (!validToken) {
      token = await resetTokenModel.createToken(user._id);
    } else {
      token = tokenObject.token;
    }
  }

  const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token}`;
  await sendEmail(user.email, "Password reset", renderEmail(link));
  return resHandler(res, "success", 200, {
    message: "Password reset link sent to your email",
  });
};

export const newPassword = async (req, res, next) => {
  const token = req.params.token;
  const user = await User.findById(req.params.id);
  const tokenObject = await resetTokenModel.findOne({
    user: user._id,
    token: token,
  });
  if (!tokenObject) {
    return resHandler(res, "fail", 400, { message: "Invalid link or expired" });
  }
  const validToken = await tokenObject.checkValid();
  if (!validToken) {
    return resHandler(res, "fail", 400, { message: "Invalid expired" });
  }
  user.password = req.body.password;
  const newUser = await user.save();
  await tokenObject.dump();

  if (req.accepts()[0] == "text/html") {
    return res.status(200).send(`
    <body style="display: flex; justify-content:center">
    <h1 style="margin-top: 5rem;">Your password has been changed successfully</h1>
    <p>Use it to login. All your sessions are invalidate</p>
    </body>`);
  }

  return responseHandler(res, "success", 200, {
    message: "Your password has been updated. Use the new password to login in",
  });
};

export const resetLinkValidator = async (req, res, next) => {
  const token = req.params.token;
  const user = await User.findById(req.params.id);
  const tokenObject = await resetTokenModel.findOne({
    user: user._id,
    token: token,
  });

  if (!tokenObject) {
    if (req.accepts()[0] == "text/html") {
      return res.status(400).send("<h1>Invalid link or expired</h1>");
    } else {
      return resHandler(res, "fail", 400, {
        message: "Invalid link or expired",
      });
    }
  }
  const validToken = await tokenObject.checkValid();
  if (!validToken) {
    if (req.accepts()[0] == "text/html") {
      return res.status(400).send("<h1>Invalid link or expired</h1>");
    } else {
      return resHandler(res, "fail", 400, {
        message: "Invalid link or expired",
      });
    }
  }
  if (req.accepts()[0] == "text/html") {
    return res.status(200).sendFile("reset.html", {
      root: join(__dirname, "templates"),
      dotfiles: "deny",
      headers: {
        "x-timestamp": Date.now(),
        "x-sent": true,
      },
    });
  } else {
    return resHandler(re, "success", 200, {
      message: "The link is valid. Use it to send the new Password",
    });
  }
};
//add your function to export
export {
  loginView,
  createUserView,
  updateUserView,
  deleteUserView,
  getUserView,
  refreshTokenView,
  logoutView,
};
