import { Request, Response } from 'express'
import { createChat, createGroupChat } from '../services/chat.service'
import { UserType } from '../services/types.service'
import { getChatService } from '../services/getChat.service'

export const getAllMessagesByChatId = async (req: Request<{id: string}>, res: Response) => {
  try {
    const user = req.user!.user as UserType
    const route = req.params.id
    const [populated, error] = await getChatService(route, user.id)
    if (!populated) throw new Error(error!.message);

    res.status(200).json(populated)
  } catch (error) {
    res.status(400).send((error as Error).message)
  }
}

export const createNewChat = async (req: Request<any, any,{phone_number: string}>, res: Response) => {
  try {
    const user = req.user!.user as UserType
    const result = await createChat(user, req.body.phone_number)
    res.status(result.status!).json(result)
  } catch (error) {
    res.status(400).send((error as Error).message)
  }
}

export const createNewGroup = async (req: Request<any, any, {group_name: string}>, res: Response) => {
  try {
    const user = req.user!.user as UserType
    res.status(201).json(await createGroupChat(user, req.body.group_name))
  } catch (error) {
    res.status(400).send((error as Error).message)
  }
}
