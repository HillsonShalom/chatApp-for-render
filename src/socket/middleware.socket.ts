import { Token } from "../Tokem.model";
import { AuthenticatedSocket } from "./router.socket";
import jwt from 'jsonwebtoken'
import User from '../models/user.model'

export const socketMiddleware = async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
    const authorization = socket.handshake.auth.token;
    if (!authorization) {
        return next(new Error("Auth"));
    }
 
    try {
        if (authorization.split(' ')[0] !== 'Bearer') throw new Error("Wrong token!");

        const token = authorization.split(' ')[1]
        const userid = jwt.verify(token, process.env.SECRET_KEY!) as Token
        const user = await User.findById(userid.user)
        if (!user) throw new Error("Wrong token content");

        socket.user = user
        next()
    }catch(err) {
        next(new Error("Authentication error: Invalid token"))
    }
}