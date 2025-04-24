import express from "express"
import { registerUser, loginUser, logoutUser, getCurrentUser} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/check', protectRoute, getCurrentUser)

export default router