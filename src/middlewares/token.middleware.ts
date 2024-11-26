import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { Token } from "../Tokem.model";
import User from "../models/user.model";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers["authorization"] as string;
    if (!authorization) throw new Error("Login first!");

        if (authorization.split(' ')[0] !== 'Bearer') throw new Error("Wrong token!")

        const token = authorization.split(' ')[1]
        const userid = jwt.verify(token, process.env.SECRET_KEY!) as Token

        const user = await User.findById(userid.user)
        if (!user) throw new Error("Wrong token content");

        req.user = {user}

        next()

    } catch(err) {
        res.status(401).send((err as Error).message)
    }
}

export default verifyToken;
