import { v4 as uuid, validate as isValidUUID } from "uuid";
import { responseHandler } from "../config/utils.js";
import { contactModel, replyModel } from "./models.js";

export const saveContact = async (req, res, next) => {
  let message = req.body;

  message["ticket"] = uuid();
  const newMessage = await contactModel.create(message);
  return responseHandler(res, "success", 201, newMessage);
};
export const getContacts = async (req, res, next) => {
  const messages = await contactModel.find({ open: true });
  return responseHandler(res, "success", 200, messages);
};
export const replyMessage = async (req, res, next) => {
  const message = await contactModel.findById(req.params.id);
  if (!message) {
    return responseHandler(res, "fail", 404, "Not found");
  }
  if (message.meta.replied) {
    return responseHandler(res, "fail", 400, {
      message: "This message was replied to",
    });
  }
  let reply = req.body;
  reply["user"] = req.userId;
  reply["message"] = message._id;
  const newReply = await replyModel.create(reply);
  await message.close();
  return responseHandler(res, "success", 200, newReply);
};

export const deleteMessage = async (req, res, next) => {
  const message = await contactModel.findById(req.params.id);
  if (!message) {
    return responseHandler(res, "fail", 404, "Not found");
  }
  await message.delete();
  return responseHandler(res, "success", 200, {});
};

export const checkStatus = async (req, res, next) => {
  const ticket = req.params.ticket;
  if (!isValidUUID(ticket))
    return responseHandler(res, "fail", 400, "Invalid ticket");
  if (!ticket)
    return responseHandler(res, "fail", 400, {
      message: "Missing ticket in the request parameters",
    });
  const msg = await contactModel.findOne({ ticket: ticket });
  if (!msg) {
    return responseHandler(res, "fail", 404, "Not found");
  }
  const msgStatus = {
    sender: {
      name: msg.name,
      email: msg.email,
    },
    message: msg.message,
    ticket: msg.ticket,
    date: msg.date,
    open: msg.open,
  };
  const open = req.query.open;
  if (open && open == "true") {
    let newMessage = await msg.reopen();
    return responseHandler(res, "success", 200, {
      message: "You have reopened you issue. We are looking into it",
    });
  }
  return responseHandler(res, "success", 200, msgStatus);
};
