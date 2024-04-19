import { format } from "date-fns";
import { existsSync, promises as fsPromises } from "fs";
import * as nodeEmoji from 'node-emoji'
import path, { join } from "path";
import { v4 as uuid } from "uuid";

export const responseHandler = (res, status, code, message) => {
  let response = { status: status, code: code };
  if (typeof message == "string") {
    response["message"] = message;
  } else {
    response["data"] = message;
  }
  return res.status(code).json(response);
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

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    console.error(error);
    return res
      .status(406)
      .send({ code: 406, status: "fail", message: error.message }); // Bad request
  } else if (error.code == 'ERR_HTTP_HEADERS_SENT') {
    
  } else {
    return responseHandler(
      res,
      "error",
      500,
      errorMessage[Math.floor(Math.random() * errorMessage.length)]
    );
  }
};

export const asyncHandler = (func) => (req, res, next) => {
  return Promise.resolve(func(req, res, next)).catch(next);
};
