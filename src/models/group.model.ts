import mongoose, { Document, model, Schema, Types } from 'mongoose'
import { IUser, userSchema } from './user.model'

export interface IGroup extends Document {
  name: string
  admins: Types.ObjectId[] | IUser[]
  photo_url?: string,
}

export const groupSchema = new Schema<IGroup>({
  name: String,
  photo_url: String,
  admins:{
    type: [Types.ObjectId],
    ref: 'User',
    default: []
  }
})

export default mongoose.models.Group || model<IGroup>('Group', groupSchema)