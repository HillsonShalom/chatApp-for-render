import mongoose, { Document, model, Schema, Types } from "mongoose";
import { IUser, userSchema } from "./user.model";

export interface IMessage extends Document {
  updatedAt?: any;
  createdAt?: any;
  content: string;
  author: Types.ObjectId | IUser;
  likes?: string[];
}

export const messageSchema = new Schema<IMessage>(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Types.ObjectId,
      ref: "User",
    },
    likes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  model<IMessage>("Message", messageSchema);
