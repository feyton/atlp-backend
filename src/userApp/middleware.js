import validator from "validator";
const { isEmail } = validator;
import * as models from "./models.js";
import jsonwebtoken from "jsonwebtoken";
import { hash, compare } from "bcrypt";
const jwt = jsonwebtoken;
const User = models.userModel;

export const validateSignUpData = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Bad request" });
  }
  const isEmailValid = validator.isEmail(email);
  if (!isEmailValid) return res.sendStatus(406);

  const duplicateEmail = await User.findOne({ email: email }).exec();
  if (duplicateEmail) {
    return res.status(409).json({ message: "Email is taken" });
  }
  const user = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  };
  req.newUser = user;
  next();
};

export const validateLogin = async (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Bad request" });
  }
  let foundUser = await User.findOne({ email: email }).exec();
  if (!foundUser) {
    return res.status(406).json({ message: "Wrong credentials" });
  }

  compare(password, foundUser.password, async (err, isMatch) => {
    if (isMatch) {
      req.foundUser = foundUser;
      next();
    } else {
      return res.status(406).json({ message: "Wrong credentials" });
    }
  });
};
