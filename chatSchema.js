import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
  username: String,
  message: String,
  timeStamp: Date,
});

export const ChatModel = mongoose.model("ChatModel", chatSchema);
