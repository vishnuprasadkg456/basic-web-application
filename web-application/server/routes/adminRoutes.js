import express from 'express';
import {
    getAllUsers,
    createUser,
    updatedUser,
    deleteUser,
} from '../controllers/adminController.js';

import {protect,authorizeRoles} from '../middleware/auth.js';``
import { loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser);

router.use(protect,authorizeRoles('admin')); //all below routes are protected and admin only



router.get('/users',getAllUsers);//view or search all users

router.post('/users',createUser); //create new user

router.put('/users/:id',updatedUser);//edit user

router.delete('/users/:id',deleteUser); //delete user

export default router;

