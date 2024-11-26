import chatModel from "../models/chat.model";
import messageModel from "../models/message.model";
import { UserType } from "./types.service";

export const sendMessageService = async (user: UserType, chatId: string, content: string) => {
    try {
        const chat = await chatModel.findById(chatId)
        if (!chat) throw new Error("chat not found!")
        const message = await (new messageModel({content, author: user.id})).save()
        chat.messages.push(message.id)
        await chat.save()
    } catch(err) {
        throw err as Error
    }
}