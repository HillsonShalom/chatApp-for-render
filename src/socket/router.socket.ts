import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { Server, Socket } from "socket.io";
import { UserType } from "../services/types.service";
import { socketMiddleware } from "./middleware.socket";
import userModel, { IUser } from "../models/user.model";
import { sendMessageService } from "../services/sendMessage.service";
import NewMessageDto from "../DTO/newMessageDto";
import {
  addLikeToMsg,
  addMemberToChat,
  createNewMessage,
  getMessagesByChatId,
} from "../services/chat.service";
import likeDTO from "../DTO/likeDTO";
import joinMemberDto from "../DTO/joinMemberDto";

class SocketRouter {
  static users = new Map<string, Socket>()
  constructor(private io: Server) {
    this.io.use(socketMiddleware);
    io.on("connect_error", (err?: Error) => {
    });
  }

  connection = async (socket: AuthenticatedSocket) => {
    console.log("user connected: " + (socket.user as IUser).name);
    console.log("connections: ", this.io.engine.clientsCount);
    SocketRouter.users.set(socket.user?.id as string, socket);
    (socket.user as IUser).chats.forEach((chat) => {
      socket.join(`${chat}`);
    });

    socket.on("new_message", async (data: NewMessageDto) => {
      const newMessage = await createNewMessage(
        (socket.user as IUser).id as string,
        data.chat_id,
        data.text_content
      );

      this.io
        .to(data.chat_id)
        .emit("new_message_expted", await getMessagesByChatId(data.chat_id));
    });

    socket.on("join_member", async (data: joinMemberDto) => {
      const [friendId, chat] = await addMemberToChat(data.chat_id, data.phone_number);
      const friendSocket = SocketRouter.users.get(friendId);
      if (friendSocket && chat) {
        const newGroup: dto = {id: chat.id, name: chat.group.name, photo_url: chat.group.photo_url}
        friendSocket.emit("joined", newGroup)
      }
    })

    socket.on("like", async (data: likeDTO) => {
      try {
        await addLikeToMsg(data.chat_id, data.msg_id, data.like);
        this.io.to(data.chat_id).emit("like", await getMessagesByChatId(data.chat_id));
      } catch (error: any) {
        console.error("Error handling like event:", error.message);
      }
    });

    socket.on(
      "message",
      ({ chat_id, content }: { chat_id: string; content: string }) => {
        sendMessageService(socket.user as UserType, chat_id, content);
      }
    );

    socket.on('join_room', async () => {
      const dbUser = await userModel.findById(socket.user?._id)
      console.log(dbUser.chats[dbUser.chats.length -1] + " joined successfully!");
      socket.join(`${dbUser.chats[dbUser.chats.length -1]}`);
    })

    socket.on("disconnect", () => {
      console.log("user disconnected");
      SocketRouter.users.delete(socket.user!.id as string)
    });
  };
}

export interface AuthenticatedSocket extends Socket {
  user?: Types.ObjectId | IUser;
}

export default SocketRouter;


interface dto {
  name: string;
  photo_url?: string;
  id: string;
}