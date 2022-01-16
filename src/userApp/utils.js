
import jwt from "jsonwebtoken";
import { badRequestResponse } from "../blogApp/errorHandlers.js";

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return errorHandler(res, "fail", 401, "Unauthorized! Access Token expired");
  }
  return errorHandler(res, "fail", 401, "Unauthorized. Invalid Token received");
};

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return badRequestResponse(res, "Missing required header");
  const token = authHeader.split(" ")[1];
  if (!token) return errorHandler(res, "fail", 400), "Not provided token";
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    // console.log(err);
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded._id;
    req.user = decoded;
    next();
  });
};

const errorHandler = (res, status, code, message) => {
  if (typeof message == String) {
    return res.status(code).json({
      status: status,
      code: code,
      message: message,
    });
  } else {
    return res.status(code).json({
      status: status,
      code: code,
      data: message,
    });
  }
};
