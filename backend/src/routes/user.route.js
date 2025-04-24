import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { searchUsers, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/search', protectRoute, searchUsers);
router.put('/update-profile', protectRoute, updateProfile)


export default router;