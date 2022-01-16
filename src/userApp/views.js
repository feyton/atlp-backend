//This is where all business logic is handled
//Equivalent to middleware. Create functions that process request here
//Remember to import all in routes

import { compare } from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import {
  badRequestResponse,
  forbidenAccess,
  serverError,
  successResponse,
} from "../blogApp/errorHandlers.js";
import * as models from "./models.js";
import { RefreshToken } from "../config/models.js";
const User = models.userModel;
let tokenExpiration = process.env.JWT_EXPIRATION;

const loginView = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email }).exec();

    let userInfo = {
      email: user.email,
      roles: user.roles,
      _id: user._id,
    };
    console.log(tokenExpiration);

    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: parseInt(tokenExpiration),
    });
    let refreshToken = await RefreshToken.createToken(user);
    //The refreshToken is returned as a cookie and only accessible
    //Via Http. This prevent prevent access from JS
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    userInfo["token"] = accessToken;

    return res.status(200).json({
      status: "success",
      code: 200,
      data: userInfo,
    });
  } catch (err) {
    console.log(err);
    return serverError(res);
  }
};

const createUserView = async (req, res) => {
  try {
    const result = await User.create(req.body);
    const { password, ...others } = result._doc;
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Login is required to access protected resources",
      data: {
        user: others,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Something went wrong on our end",
    });
  }
};

const updateUserView = async (req, res) => {
  if (req.userId === req.params.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      const { password, ...others } = updatedUser._doc;
      return successResponse(res, others);
    } catch (error) {
      return serverError(res);
    }
  } else {
    return forbidenAccess(res);
  }
};

const deleteUserView = async (req, res) => {
  if (req.userId === req.params.id) {
    try {
      let { password } = req.body;
      if (!password)
        return res.status(400).json({
          status: "fail",
          code: 400,
          data: { password: "Password is required to delete user" },
        });

      const user = await User.findById(req.params.id);
      if (!user)
        return res.status(404).json({
          status: "fail",
          message: "Not found",
          code: 404,
        });
      compare(password, user.password, async (err, isMatch) => {
        if (isMatch) {
          user.delete();
          res.clearCookie("jwt", { httpOnly: true });

          return res.status(200).json({
            sataus: "success",
            code: 200,
            data: null,
          });
        } else {
          return res.status(400).json({
            status: "fail",
            code: 400,
            message: "Invalid credentials",
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        code: 500,
        message: "Something went wrong on our end",
      });
    }
  } else if (!req.params.id) {
    return res.status(400).json({
      status: "fail",
      code: 400,
      message: "Missing required parameter",
    });
  } else {
    return res.status(403).json({
      status: "fail",
      code: 403,
      message: "You can only delete your account",
    });
  }
};

const getUserView = async (req, res) => {
  if (req.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (!user)
        return res.status(404).json({
          status: 404,
          code: 404,
          message: "Resource not found",
        });

      let userInfo = {
        email: user.email,
        lastName: user.lastName,
        firstName: user.firstName,
        roles: user.roles,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        _id: user._id,
      };
      return res.status(200).json({
        status: "success",
        code: 200,
        data: {
          user: userInfo,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        code: 500,
        message: "Something went wrong on our end.",
      });
    }
  } else {
    return res.status(403).json({
      status: "fail",
      code: 403,
      message: "You can only view your account",
    });
  }
};

const refreshTokenView = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies || !cookies.jwt)
    return badRequestResponse(res, "A valid jwt cookie missing. Login first");

  const refreshToken = cookies.jwt;
  const userToken = await RefreshToken.findOne({
    token: refreshToken,
  }).populate("user");
  if (!userToken) {
    return forbidenAccess(res, "Refresh token is not in the database");
  }

  if (RefreshToken.verifyExpiration(userToken)) {
    await RefreshToken.findByIdAndDelete(userToken._id).exec();
    res.clearCookie("jwt", { httpOnly: true });
    return forbidenAccess(res, "Refresh token was expired. Login again");
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

  return res
    .status(200)
    .json({ status: "success", code: 200, data: { token: accessToken } });
};

const logoutView = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies || !cookies.jwt)
    return res.status(403).json({
      status: "fail",
      code: 403,
      message: "Already signed out",
    });

  const refreshToken = cookies.jwt;
  const userToken = await RefreshToken.findOne({
    token: refreshToken,
  }).exec();

  if (!userToken)
    return res.status(403).json({
      status: "fail",
      code: 403,
      message: "Already signed out",
    });
  await RefreshToken.findByIdAndDelete(userToken._id);
  res.clearCookie("jwt", { httpOnly: true });
  return res.status(200).json({
    status: "success",
    code: 200,
    data: null,
  });
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
