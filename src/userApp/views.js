import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../config/models.js";
import { responseHandler as resHandler } from "../config/utils.js";
import { userModel as User } from "./models.js";
import { clearCookie } from "./utils.js";
dotenv.config();

let tokenExpiration = process.env.JWT_EXPIRATION;

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
  const result = await User.create(req.body);
  const { password, ...others } = result._doc;
  return resHandler(res, "success", 201, {
    message: "Login is required to access protected resources",
    user: others,
  });
};

const updateUserView = async (req, res, next) => {
  if (!req.userId === req.params.id)
    return resHandler(res, "fail", 403, "Forbiden access");

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
    return resHandler(res, "fail", 400, "Invalid credentials");
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
