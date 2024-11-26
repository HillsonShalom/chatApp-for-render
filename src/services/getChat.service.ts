import chatModel from "../models/chat.model";
import messageModel from "../models/message.model";
import userModel from "../models/user.model";

export const getChatService = async (
  id: string,
  userId: string
): Promise<[dto | null, Error | null]> => {
  try {
    new messageModel();
    const chat = (await chatModel
      .findById(id)
      .populate([
        { path: "members", select: "-password -chats" },
        { path: "messages" },
        { path: "group" },
      ])
      .exec()) as expextRecieving;

    // השתמשתי פה בסימן השוואה לא מדוייקת, כי אחרת הוא יחזיר תמיד שקר כי זה סטרינג וזה אובייקט-איי-די
    const forReturn: dto = {
      members: chat.members.map((m) => {
        return {
          name: m.name,
          phone_number: m.phone_number,
          photo_url: m.photo_url,
          id: m._id,
          is_admin: chat.group?.admins.includes(m._id),
        };
      }),
      messages: chat.messages.map((s) => {
        return {
          id: s._id,
          content: s.content,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          from: s.author,
          likes: s.likes,
        };
      }),
      chat_name: chat.group
        ? chat.group.name
        : chat.members.find((m) => m._id != userId)!.name,
      photo_url: chat.group
        ? chat.group.photo_url
        : chat.members.find((m) => m._id != userId)!.photo_url,
      is_group: chat.group ? true : false,
      id,
    };


    return [forReturn, null];
  } catch (err) {
    console.error((err as Error).message);
    return [null, err as Error];
  }
};

interface dto {
  members: {
    id: string;
    name: string;
    phone_number: string;
    photo_url?: string;
    is_admin?: boolean;
  }[];
  messages: {
    id: string;
    content: string;
    from: string;
    createdAt: Date;
    updatedAt: Date;
    likes?: string[];
  }[];
  id?: string;
  chat_name: string;
  photo_url?: string;
  is_group: boolean;
}

interface expextRecieving {
  members: {
    _id: string;
    name: string;
    phone_number: string;
    photo_url?: string;
  }[];
  messages: {
    _id: string;
    author: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    likes?: string[];
  }[];
  group?: {
    name: string;
    admins: string[];
    photo_url?: string;
  };
}
