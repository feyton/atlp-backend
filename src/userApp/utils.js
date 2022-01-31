import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { responseHandler } from "../config/utils.js";
dotenv.config();

const { TokenExpiredError } = jwt;

export const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return responseHandler(
      res,
      "fail",
      401,
      "Unauthorized! Access Token expired"
    );
  }
  return responseHandler(
    res,
    "fail",
    401,
    "Unauthorized. Invalid Token received"
  );
};

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return responseHandler(
      res,
      "fail",
      401,
      "Unauthorized. Missing token in header"
    );
  const token = authHeader.split(" ")[1];
  if (!token) {
    return responseHandler(
      res,
      "fail",
      401,
      "Unauthorized. Missing token in header"
    );
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded._id;
    req.user = decoded;
    next();
  });
};

export const clearCookie = (res) => {
  return res.cookie("jwt", "", { httpOnly: true, maxAge: 1 }).status(200).json({
    status: "success",
    code: 200,
    data: {},
  });
};

export const pswResetToken = () => {};

export const sendEmail = async (email, subject, html) => {
  try {
    let transport = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "joe.wilderman28@ethereal.email",
        pass: "1frKw3xHDUkeErtbdf",
      },
    });
    const sentMail = await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: html,
    });
    console.log("Email sent successfully");
    console.log("Preview Url: %s", nodemailer.getTestMessageUrl(sentMail));
  } catch (error) {
    console.log(error);
  }
};
