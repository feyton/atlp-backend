//This is where all business logic is handled
//Equivalent to middleware. Create functions that process request here
//Remember to import all in routes

import * as models from "./models.js";
import jsonwebtoken from "jsonwebtoken";
import { hash, compare } from "bcrypt";
const jwt = jsonwebtoken;
const User = models.userModel;

const loginView = async (req, res) => {
  try {
    let foundUser = req.foundUser;

    let userInfo = {
      email: foundUser.email,
      roles: foundUser.roles,
      _id: foundUser._id,
    };
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "120s",
    });
    if (foundUser.refreshToken == "" || !foundUser.refreshToken) {
      const refreshToken = jwt.sign(
        userInfo,
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "7d",
        }
      );
      foundUser.refreshToken = refreshToken;
      const user = await foundUser.save();
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
    }

    return res.status(200).json({ accessToken });
    //    return res.json({ message: "Login" });

    // console.log(await foundUser.isValidPassword(password));
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const createUserView = async (req, res) => {
  try {
    const result = await User.create(req.newUser);
    res.status(201).json({
      message: "Your account has been created. Login first",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const updateUserView = async (req, res) => {
  if (req.user._id === req.params.id) {
    try {
      let { firstName, lastName } = req.body;
      console.log(req.body);

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      !updatedUser &&
        res.status(401).json({ message: "Something happened on our end" });
      res
        .status(201)
        .json({ message: "Your account has been updates", data: updatedUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const deleteUserView = async (req, res) => {
  if (req.user._id === req.params.id) {
    try {
      let { password } = req.body;
      if (!password)
        return res
          .status(401)
          .json({ message: "Password is required to delete user" });

      const user = await User.findById(req.params.id);
      if (!user) return res.sendStatus(403);
      compare(password, user.password, async (err, isMatch) => {
        if (isMatch) {
          user.delete();
          res.clearCookie("jwt", { httpOnly: true });
          res.status(201).json({ message: "User deleted sucessfully" });
        } else {
          res.status(403).json({ message: "Invalid credentials" });
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(401)
      .json({ message: "You can only delete your account" });
  }
};

const getUserView = async (req, res) => {
  if (req.user._id === req.params.id) {
    try {
      const user = await User.findById(req.params.id);

      !user && res.status(401).json({ message: "Bad request" });
      let userInfo = {
        email: user.email,
        lastName: user.lastName,
        firstName: user.firstName,
        roles: user.roles,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        _id: user._id,
      };
      res.status(201).json({ data: userInfo });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const refreshTokenView = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies || !cookies.jwt) return res.sendStatus(401);
  console.log(cookies);

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        email: decoded.email,
        _id: decoded._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "50s" }
    );
    res.json({ accessToken });
  });
};

const logoutView = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies || !cookies.jwt) return res.sendStatus(401);
  console.log(cookies);

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403);
  foundUser.refreshToken = "";
  res.clearCookie("jwt", { httpOnly: true });
  await foundUser.save();
  return res.sendStatus(204);
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
