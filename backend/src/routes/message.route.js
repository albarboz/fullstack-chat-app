import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { getUsersForConvoList, getMessages, sendMessage, getAllMessages } from '../controllers/message.controller.js'

const router = express.Router()

router.get('/users', protectRoute, getUsersForConvoList)
router.get('/:id', protectRoute, getMessages)
router.get('/', protectRoute, getAllMessages)
router.post('/send/:id', protectRoute, sendMessage)


export default router