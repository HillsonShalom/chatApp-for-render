import { Types } from "mongoose"
import { Token } from "./Tokem.model"

declare module 'express' {
    interface Request {
        user?: Token
    }
}

export {}