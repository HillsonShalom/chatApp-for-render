/// <reference path="../extensions.d.ts" />

import { Request, Response } from 'express'
import registerDTO from '../DTO/registerDTO'
import { loginUser, registerUser } from '../services/userService'
import loginDTO from '../DTO/loginDTO'
import jwt from 'jsonwebtoken'
import { Token } from '../Tokem.model'
import { UserType } from '../services/types.service'
import { getUserService } from '../services/getUser.service'

export const register = async (
  req: Request<any, any, registerDTO>,
  res: Response
) => {
  try {
    const result = await registerUser(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json((error as Error).message)
  }
}

export const login = async (
  req: Request<any, any, loginDTO>,
  res: Response
) => {
  try {
    const result =  await loginUser(req.body)
    res.setHeader('Authorization', result)
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json((error as Error).message)
  }
}

export const getUserWithChats = async (req: Request, res: Response) => {
  try {
    const user = req.user!.user as UserType
    const [populated, error] = await getUserService(user.id)
    if (!populated) throw new Error(error!.message);

    res.status(200).json(populated)
  } catch (error) {
    res.status(400).json((error as Error).message)
  }
}

export const setPhoto = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user!.user as UserType
    const fileInfo = req.file;
    if (!fileInfo) {
      throw new Error('No file uploaded.')
    }
    user.photo_url = 'https://chatapp-for-render.onrender.com/images/' + fileInfo.filename
    await user.save()
  res.send(`File ${fileInfo.filename} uploaded successfully!`);
  } catch (error) {
    res.status(400).json((error as Error).message)
  }
}