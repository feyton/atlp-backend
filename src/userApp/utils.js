import jwt from "jsonwebtoken";
import { serverError } from "../blogApp/errorHandlers.js";


const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const cookies = req.cookies;
  if (!authHeader && !cookies.jwt)
    return res.status(400).json({
      status: "fail",
      code: 400,
      data: {
        parameter: "Authorization header required or a valid cookie",
      },
    });
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err && !cookies.jwt) {
          return res.status(403).json({
            status: "fail",
            code: 403,
            message: "invalid/Expired token was received",
          });
        }
        req.user = decoded;
        next();
      });
    }
  } else if (cookies.jwt) {
    const jwtCookie = cookies.jwt;
    jwt.verify(jwtCookie, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: "fail",
          code: 403,
          message: "invalid/Expired token was received",
        });
      }
      req.user = decoded;
      next();
    });
  } else {
    return serverError(res);
  }
};

export { verifyJWT };
