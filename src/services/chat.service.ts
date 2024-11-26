import { Types } from "mongoose";
import chatModel, { IChat } from "../models/chat.model";
import userModel from "../models/user.model";
import messageModel, { IMessage } from "../models/message.model";
import { UserType } from "./types.service";
import groupModel from "../models/group.model";

export const createChat = async (
  user: UserType,
  phone_number: string
): Promise<dto> => {
  try {
    const userToAddToChat = await userModel.findOne({ phone_number });
    if (!userToAddToChat) throw new Error("phone not found");

    // לוודא שלא קיים כבר צ'אט בין 2 היוזרים
    const alreadyExist = await chatModel.findOne({
      members: { $all: [user._id, userToAddToChat._id], $size: 2 },
      group: { $exists: false }
    });
    if (alreadyExist) {
      return {
        status:200,
        id: alreadyExist._id,
        name: userToAddToChat.name,
        photo_url: userToAddToChat.photo_url,
      };
    }

    const dbChat = new chatModel({
      members: [user._id, userToAddToChat._id],
    });
    const newChat = await dbChat.save();


    // שמירה של הצ'אט שנוצר ברשימת הצ'אטים שמחזיק כל אחד מהם
    user.chats.push(newChat._id);
    await user.save();
    userToAddToChat.chats.push(newChat._id);
    await userToAddToChat.save();

    const ret: dto = {
      status:201,
      name: userToAddToChat.name,
      id: newChat._id,
      photo_url: userToAddToChat.photo_url,
    };
    return ret;
  } catch (error) {
    throw error;
  }
};

export const createGroupChat = async (
  user: UserType,
  group_name: string
): Promise<dto> => {
  try {
    const dbGroup = new groupModel({
      name: group_name,
      admins: [user._id],
    });
    const newGroup = await dbGroup.save();
    const dbChat = new chatModel({
      members: [user._id],
      group: dbGroup._id,
    });
    const newChat = await dbChat.save();

    user.chats.push(newChat._id);
    await user.save();
    return {
      id: newChat._id,
      name: newGroup.name,
      photo_url: newGroup.photo_url,
    };
  } catch (error) {
    throw error;
  }
};

interface dto {
  status?:number;
  name: string;
  photo_url?: string;
  id: string;
}

export const createNewMessage = async (
  user_id: string,
  chat_id: string,
  text_content: string
) => {
  try {
    const dbMessage = new messageModel({
      content: text_content,
      author: user_id,
    });

    await dbMessage.save();
    const updetedChat = await chatModel.findByIdAndUpdate(chat_id, {
      $push: { messages: dbMessage._id },
    });
    if (!updetedChat) throw new Error("chat not found");

    return dbMessage;
  } catch (error) {
    throw error;
  }
};

export const addMemberToChat = async (
  chat_id: string,
  phone_number: string
) => {
  try {
    const userToInsert = await userModel.findOne({ phone_number });

    if (!userToInsert) throw new Error("user not found");

    const chat = await chatModel.findById(chat_id)
    userToInsert.chats.push(chat._id)
    await userToInsert.save()
    if (chat.members.includes(userToInsert._id)) throw new Error("already joined!")
    chat.members.push(userToInsert._id)
    const updatedChat = await chat.save()
    return [userToInsert._id as string, updatedChat];
  } catch (error) {
    throw error;
  }
};

export const getMessagesByChatId = async (chat_id: string) => {
  try {
    const dbChat = await chatModel
      .findById(chat_id)
      .populate("messages")
      .lean();
    const messages: IMessage[] = (dbChat as any).messages;

    const modifyMessages = messages.map((m: IMessage) => ({
      id: m._id,
      content: m.content,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      from: m.author,
      likes: m.likes,
    }));
    return modifyMessages;
  } catch (error) {
    throw error;
  }
};

export const addLikeToMsg = async (
  chat_id: string,
  msg_id: string,
  like: string
) => {
  try {
    if (!chat_id || !msg_id || !like)
      throw new Error("chat_id, msg_id, and like are required!");

    const findMsgById = await messageModel.findOne({ _id: msg_id });
    if (!findMsgById) throw new Error("Message not found!");

    findMsgById.likes.push(like);
    return await findMsgById.save();
  } catch (error: any) {
    throw new Error(`Could not add like to message: ${error.message}`);
  }
};
