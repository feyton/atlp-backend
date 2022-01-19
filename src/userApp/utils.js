import jwt from "jsonwebtoken";
import { responseHandler } from "../config/utils.js";

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
    return responseHandler(res, "fail", 400, "Missing required header");
  const token = authHeader.split(" ")[1];
  if (!token) {
    return responseHandler(res, "fail", 400, "Not provided token");
  }
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
