import mongoose, { Document, model, Schema, Types } from 'mongoose'
import { chatSchema, IChat } from './chat.model'

export interface IUser extends Document {
  name: string
  password: string
  phone_number: string
  chats: Types.ObjectId[] | IChat[]
  photo_url?: string
}

export const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [4, 'password must heve atleast 4 chars']
  },
  phone_number: {
    type: String,
    required: [true, 'phon number nust be provided'],
    unique: true,
    minlength: [5, 'phon number is to short, must hev atleast 5 chars']
  },
  chats: {
    type: [Schema.Types.ObjectId],
    ref: 'Chat',
    default: []
  },
  photo_url: String
})


export default mongoose.models.User || model<IUser>('User', userSchema)