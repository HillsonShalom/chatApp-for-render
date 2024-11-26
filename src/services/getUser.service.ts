import User from "../models/user.model";
import Chat from "../models/chat.model";
import Group from "../models/group.model";
import { UserType } from "./types.service";
import mongoose from "mongoose";
import { conectToMongo } from "../config/db";

export const getUserService = async (
  id: string
): Promise<[dto | null, Error | null]> => {
  try {
    // await conectToMongo();
    new Chat(); // אחרת הוא יזרוק שגיאה כי הוא לא "נרשם" למודל
    new Group();
    const user = (await User.findById(id)
      .select("-password -_id")
      .populate({
        path: "chats",
        select: "-messages",
        populate: [
          { path: "members", select: "-password -chats -_id" },
          { path: "group", select: "name photo_url -_id" },
        ],
      })
      .exec()) as expextRecieving;
    if (!user) throw new Error("user not found");

    const forReturn: dto = {
      id,
      name: user.name,
      phone_number: user.phone_number,
      photo_url: user.photo_url,
      chats: user.chats.map((c) => {
        return {
          id: c._id,
          name: c.group
            ? c.group.name
            : c.members.find((m) => m.phone_number !== user.phone_number)!.name,
          photo_url: c.group
            ? c.group.photo_url
            : c.members.find((m) => m.phone_number !== user.phone_number)!
                .photo_url,
        };
      }),
    };

    return [forReturn, null];
  } catch (err) {
    console.log((err as Error).message); // *******
    return [null, err as Error];
  }
};

interface dto {
  id: string;
  name: string;
  phone_number: string;
  photo_url?: string;
  chats: {
    name: string;
    photo_url?: string;
    id: string;
  }[];
}

interface expextRecieving {
  name: string;
  phone_number: string;
  chats: {
    _id: string;
    members: {
      name: string;
      phone_number: string;
      photo_url?: string;
    }[];
    group?: {
      name: string;
      photo_url?: string;
    };
  }[];
  photo_url?: string;
}
