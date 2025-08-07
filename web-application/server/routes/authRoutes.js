import express from 'express';
import { registerUser,loginUser } from '../controllers/authController.js';
const router = express.Router();

router.post('/user/register',registerUser);

router.post('/user/login',loginUser);//user role

router.post('/admin/login',loginUser);//admin role


export default router;