//This is where all business logic is handled
//Equivalent to middleware. Create functions that process request here
//Remember to import all in routes

import * as models from "./models.js";
import jsonwebtoken from "jsonwebtoken";
const jwt = jsonwebtoken;
const User = models.userModel;

const loginView = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({ message: "Bad request" });
    }
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      return res.status(400).json({ message: "Wrong credentials" });
    }

    const validatePassword = user.isValidPassword(password);
    if (!validatePassword) {
      return res.status(400).json({ message: "wrong credentials" });
    }

    let userInfo = {
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
      roles: user.roles,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      _id: user._id,
    };
    const accessToken = await jwt.sign(
      {
        email: userInfo.email,
        usedId: userInfo._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "120s",
      }
    );
    const refreshToken = jwt.sign(
      {
        email: userInfo.email,
        usedId: userInfo._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    return res.status(200).json({ accessToken });
    //    return res.json({ message: "Login" });
  } catch (err) {
    console.log(err);
  }
};

const createUserView = async (req, res) => {
  try {
    let { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(403).json({ message: "Bad request" });
    }
    const duplicateEmail = await User.findOne({ email: email }).exec();
    if (duplicateEmail) {
      return res.status(403).json({ message: "Email taken" });
    }
    const result = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });
    res.status(201).json({ message: "created", data: result });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: err.message });
  }
};

const updateUserView = async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      let { firstName, lastName, password } = req.body;
      console.log(req.body);

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          firstName: firstName,
          lastName: lastName,
        },
        { new: true }
      );

      !updatedUser && res.status(401).json({ message: "Bad request" });
      res.status(201).json({ data: updatedUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const deleteUserView = async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      let { password } = req.body;
      !password &&
        res
          .status(401)
          .json({ message: "Password is required to delete user" });

      const user = await User.findById(req.params.id);
      const isValidPassword = user.isValidPassword(password);
      !isValidPassword &&
        res.status(403).json({ message: "Invalid credentials" });
      await User.findByIdAndDelete(req.params.id);
      res.status(201).json({ message: "User deleted sucessfully" });
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
  if (req.body.userId === req.params.id) {
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
      res.status(500).json({ message: error.message });
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
        userInfo: {
          email: decoded.email,
          _id: decoded._id,
        },
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
