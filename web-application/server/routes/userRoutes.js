import express from 'express';
import { getUserprofile,updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();


//Protected : Get user profile
router.get('/profile',protect,getUserprofile);

//protected : Update user profile with image
router.put('/profile',protect,upload.single('profileImage'),updateUserProfile);

export default router;