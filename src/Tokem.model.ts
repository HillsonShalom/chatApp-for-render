import { Types } from "mongoose";
import { UserType } from "./services/types.service";

export interface Token {
    user: Types.ObjectId | UserType
}