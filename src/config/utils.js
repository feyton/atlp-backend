import { format } from "date-fns";
import { existsSync, promises as fsPromises } from "fs";
import nodeEmoji from "node-emoji";
import path, { join } from "path";
import { v4 as uuid } from "uuid";

export const responseHandler = (res, status, code, message) => {
  if (typeof message == "string") {
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

const __dirname = path.resolve();

export const logEvents = async (message, file) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  try {
    if (!existsSync(join(__dirname, "logs"))) {
      await fsPromises.mkdir(join(__dirname, "logs"), {
        recursive: true,
      });
    }
    await fsPromises.appendFile(join(__dirname, "logs", file), logItem);
  } catch (error) {}
};

const buildMessage = (method) => {
  switch (method) {
    case "GET":
      return `${nodeEmoji.get("fast_forward")}`;

    case "PUT":
      return `${nodeEmoji.get("writing_hand")}`;

    case "POST":
      return `${nodeEmoji.get("latin_cross")}`;

    case "DELETE":
      return `${nodeEmoji.get("x")}`;

    default:
      return `${nodeEmoji.get("heavy_check_mark")}`;
  }
};

export const logger = async (req, res, next) => {
  logEvents(
    `${buildMessage(req.method)}\t${req.method}\t${req.headers.origin}\t${
      req.url
    }`,
    "reqLog.txt"
  );
  next();
};

const errorMessage = [
  "Something happened on our end. We have been notified",
  "These things happen sometimes. Try again after after some time.",
  "Ooops! Our problem. We are looking into this one",
];

export const errLogger = (error, req, res, next) => {
  let at = error.stack.split(/\r\n|\r|\n/)[1];
  logEvents(
    `${nodeEmoji.get("no_entry")}\t${buildMessage(req.method)}\t${
      req.method
    }\t${req.headers.origin}\t ${error.name}: \t${error.message}\t${
      req.url
    }\t ${at}`,
    "errLog.txt"
  );
  return responseHandler(
    res,
    "error",
    500,
    errorMessage[Math.floor(Math.random() * errorMessage.length)]
  );
};

export const asyncHandler = (func) => (req, res, next) => {
  return Promise.resolve(func(req, res, next)).catch(next);
};
