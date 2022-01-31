import mongoose from "mongoose";
import mongoosePaginator from "mongoose-paginate-v2";
import { sendReply, sendTicket } from "./utils.js";

const { Schema, model } = mongoose;

const contactReplySchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reply: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContactMessage",
    },
    meta: {
      tickectSent: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

contactReplySchema.post("save", async function () {
  const reply = this.reply;
  const msg = await contactModel.findById(this.message);
  sendReply(msg.ticket, await msg.getSender(), reply);
});

const contactMessageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
    ticket: {
      type: String,
      required: true,
    },
    open: {
      type: Boolean,
      default: true,
    },
    meta: {
      tickectSent: {
        type: Boolean,
        default: false,
      },
      replied: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);
contactMessageSchema.post("save", async function () {
  const msg = this;
  await sendTicket(msg.ticket, await msg.getSender());
});
contactMessageSchema.methods.getSender = async function () {
  const msg = this;
  const sender = {
    name: await msg.name,
    email: await msg.email,
  };
  return sender;
};
contactMessageSchema.methods.sendTicket = async function () {
  const msg = this;
  if (await msg.meta.tickectSent) {
    return false;
  }
  return true;
};
contactMessageSchema.methods.reopen = async function () {
  let msg = this;
  await msg.updateOne({ open: true, meta: { replied: true } });
  await msg.save();
};
contactMessageSchema.methods.close = async function () {
  let msg = this;
  await msg.updateOne({ open: false });
  await msg.save();
};
contactMessageSchema.plugin(mongoosePaginator);

export const contactModel = model("ContactMessage", contactMessageSchema);
export const replyModel = model("MessageReply", contactReplySchema);
