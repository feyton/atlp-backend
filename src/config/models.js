import dotenv from "dotenv";
import mongoose from "mongoose";
import { v4 as uuid } from "uuid";
dotenv.config();
const jwtRefreshExpiration = process.env.JWT_REFRESH_EXPIRATION;

const { Schema, model } = mongoose;

const RefreshTokenSchema = new Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expiryDate: Date,
});

RefreshTokenSchema.statics.createToken = async function (user) {
  let expiredAt = new Date();
  expiredAt.setSeconds(expiredAt.getSeconds() + parseInt(jwtRefreshExpiration));
  let token = uuid();
  let object = new this({
    token: token,
    user: user._id,
    expiryDate: expiredAt.getTime(),
  });
  let refreshToken = await object.save();
  return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = function (token) {
  return token.expiryDate.getTime() < new Date().getTime();
};

export const RefreshToken = model("RefreshToken", RefreshTokenSchema);
