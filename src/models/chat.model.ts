import mongoose, { Document, model, Schema, Types } from 'mongoose'
import { IUser, userSchema } from './user.model'
import { IMessage, messageSchema } from './message.model'
import { groupSchema, IGroup } from './group.model'

export interface IChat extends Document {
  members: Types.ObjectId[] | IUser[]
  messages: Types.ObjectId[] | IMessage[]
  group: Types.ObjectId | IGroup
}

export const chatSchema = new Schema<IChat>(
  {
    members: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: []
    },
    messages: {
      type: [Schema.Types.ObjectId],
      ref: 'Message',
      default: []
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
)

export default mongoose.models.Chat || model<IChat>('Chat', chatSchema)