//Hanle all other utility functions here and import them into other files
import jsonwebtoken from "jsonwebtoken";
import validator from "validator";
// const { body, validationResult } = require("express-validator");
const jwt = jsonwebtoken;

const userAppUtil = () => {};

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const cookies = req.cookies;
  if (!authHeader && !cookies.jwt) return res.sendStatus(401);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = decoded;
        next();
      });
    }
  } else if (cookies.jwt) {
    const jwtCookie = cookies.jwt;
    jwt.verify(jwtCookie, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = decoded;
      next();
    });
  } else {
    return res.sendStatus(401);
  }
};

const errorResponse = (error, message) => {
  const res = { code: error.code, message: message, error: error };
  return res;
};

export { userAppUtil, verifyJWT, errorResponse };
