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
  if (!isEmailValid) return res.sendStatus(400);

  const duplicateEmail = await User.findOne({ email: email }).exec();
  if (duplicateEmail) {
    return res.status(400).json({ message: "Email is taken" });
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
