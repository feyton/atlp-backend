import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../config/models.js";
import { responseHandler } from "../config/utils.js";
import * as models from "./models.js";
import { catchError } from "./utils.js";
dotenv.config();
const User = models.userModel;
let tokenExpiration = process.env.JWT_EXPIRATION;

const loginView = async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email }).exec();

  let userInfo = {
    email: user.email,
    roles: user.roles,
    _id: user._id,
  };
  const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: parseInt(tokenExpiration),
  });
  let refreshToken = await RefreshToken.createToken(user);
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
  });
  userInfo["token"] = accessToken;
  return responseHandler(res, "success", 200, userInfo);
};

const createUserView = async (req, res, next) => {
  const isTaken = await User.findOne({ email: req.body.email });
  if (isTaken) return responseHandler(res, "fail", 409, "Email is taken");
  const result = await User.create(req.body);
  const { password, ...others } = result._doc;
  return responseHandler(res, "success", 201, {
    message: "Login is required to access protected resources",
    user: others,
  });
};

const updateUserView = async (req, res, next) => {
  if (req.userId === req.params.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      const { password, ...others } = updatedUser._doc;
      return responseHandler(res, "success", 201, others);
    } catch (error) {
      return responseHandler(
        res,
        "error",
        500,
        "Unable to process your request"
      );
    }
  } else {
    return responseHandler(
      res,
      "fail",
      403,
      "You don't have access to the requested resource"
    );
  }
};

const deleteUserView = async (req, res, next) => {
  if (req.userId === req.params.id) {
    try {
      let { password } = req.body;
      if (!password)
        return responseHandler(res, "fail", 400, {
          password: "Password is required to delete user",
        });

      const user = await User.findById(req.params.id);
      if (!user)
        return responseHandler(
          res,
          "fail",
          404,
          "Requested resource can not be found"
        );

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return responseHandler(res, "fail", 400, "Invalid credentials");
      }

      user.delete();
      res.clearCookie("jwt", { httpOnly: true });

      return responseHandler(res, "success", 200, {});
    } catch (error) {
      return responseHandler(
        res,
        "error",
        500,
        "Something went wrong on our end"
      );
    }
  } else {
    return responseHandler(
      res,
      "fail",
      403,
      "You don't have access to the requested resource"
    );
  }
};

const getUserView = async (req, res, next) => {
  if (req.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (!user)
        return responseHandler(
          res,
          "fail",
          404,
          "The requested resource can not be found"
        );

      let { password, ...userInfo } = user._doc;

      return responseHandler(res, "success", 200, userInfo);
    } catch (error) {
      return responseHandler(
        res,
        "error",
        500,
        "Unable to connect to the database"
      );
    }
  } else {
    return responseHandler(
      res,
      "fail",
      403,
      "You don't have access to the requested resource"
    );
  }
};

const refreshTokenView = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies || !cookies.jwt)
    return responseHandler(
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
    return responseHandler(
      res,
      "fail",
      403,
      "Refresh token is not in the database"
    );
  }

  if (RefreshToken.verifyExpiration(userToken)) {
    await RefreshToken.findByIdAndDelete(userToken._id).exec();
    res.clearCookie("jwt", { httpOnly: true });
    return responseHandler(
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
    { expiresIn: parseInt(process.env.JWT_EXPIRATION) }
  );

  return responseHandler(res, "success", 200, { token: accessToken });
};

const logoutView = async (req, res, next) => {
  const cookies = req.cookies;
  const accessToken = req.headers["authorization"];
  if (!cookies || (!cookies.jwt && !accessToken))
    return responseHandler(res, "fail", 403, "Already signed out");

  if (cookies.jwt) {
    const refreshToken = cookies.jwt;
    const userToken = await RefreshToken.findOne({
      token: refreshToken,
    }).exec();
    if (userToken) {
      await RefreshToken.findByIdAndDelete(userToken._id);
      res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
      return responseHandler(res, "success", 200, {});
    }
    if (!userToken && !accessToken) {
      return responseHandler(res, "fail", 403, "Already signed out");
    }
  }
  if (accessToken) {
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return catchError(err, res);
        }
        const refreshtoken = await RefreshToken.findByIdAndDelete(decoded._id);
        if (!refreshtoken) {
          return responseHandler(
            res,
            "fail",
            403,
            "Forbiden! You are already logged out"
          );
        }
        return responseHandler(res, "success", 200, {});
      }
    );
  }

  await RefreshToken.findByIdAndDelete(userToken._id);
  res.clearCookie("jwt", { httpOnly: true });
  return responseHandler(res, "success", 200, {});
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
