import express from "express";
import cors from "cors";
import env from 'dotenv';
import userController from "./controllers/users.controller";
import chatController from "./controllers/chats.controller";
import { conectToMongo } from "./config/db";
import path from "path";
import socketIo from "socket.io";

env.config({
  path: process.env.NODE_ENV === "prd" ? "./.env" : "./.env.test",
});

const PORT = process.env.PORT || 3000;

import http from "http";
import { Server } from "socket.io";
import SocketRouter from "./socket/router.socket";

export const app = express();
app.use(cors());

// app.use(express.static(path.join(__dirname, "../../Client/dist")));
app.use(express.static(path.join(__dirname, '../public')))
conectToMongo();

export const server = http.createServer(app);
const io = new socketIo.Server(server, {
  cors: {
    origin: "*", // כתובת הלקוח

    methods: "*",
  },
});
const socketRouter = new SocketRouter(io);
io.on("connection", socketRouter.connection);

app.use(express.json());
app.use("/api/users", userController);
app.use("/api/chats", chatController);

server.listen(PORT, () => {
  console.log(`Server started, Visit "http://localhost:${PORT}"`);
});
