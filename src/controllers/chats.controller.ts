import { Router } from 'express'
import { createNewChat, createNewGroup, getAllMessagesByChatId } from '../routes/chats.router'
import verifyToken from '../middlewares/token.middleware'

const router = Router()

router.get('/:id', verifyToken, getAllMessagesByChatId)

router.post('/', verifyToken, createNewChat)

router.post('/group', verifyToken, createNewGroup)


export default router
