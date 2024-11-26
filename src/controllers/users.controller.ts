import { Router } from 'express'
import { getUserWithChats, login, register, setPhoto } from '../routes/users.route'
import verifyToken from '../middlewares/token.middleware'
import { upload } from '../middlewares/multer.middleware'

const router = Router()

router.get('/', verifyToken, getUserWithChats)

router.post('/login', login)

router.post('/register', register)

router.post('/photo', verifyToken, upload.single('file'), setPhoto)

export default router
