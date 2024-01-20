import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";
import { dbConnect } from "./config.js";
import { ChatModel } from "./chatSchema.js";

dotenv.config();
const app = express();

// 1. create the server
const server = http.createServer(app);

//2. Create socket server.

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket Events

io.on("connection", (socket) => {
  console.log("socket connection is established");

  // listen to the username
  socket.on("join", (data) => {
    socket.username = data;

    // send the oldlist items to the client
    ChatModel.find()
      .sort({ timeStamp: 1 })
      .limit(50)
      .then((messages) => {
        socket.emit("old_messages", messages);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  // listen to the client event
  socket.on("new_message", (message) => {
    let userMessage = {
      username: socket.username,
      message: message,
    };

    // adding the message to the db
    const newChat = new ChatModel({
      username: socket.username,
      message: message,
      timeStamp: new Date(),
    });

    newChat.save();
    // broadcast the message
    socket.broadcast.emit("broadcast_message", userMessage);
  });

  socket.on("disconnect", () => {
    console.log("connection is disconnected");
  });
});

server.listen(3400, () => {
  console.log("server is listening on port 3400");
  dbConnect();
});
