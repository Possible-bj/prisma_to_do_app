import express from 'express';
import { createUser } from '../controllers/user.Controller/createUser.Controller.js';
import { loginUser } from '../controllers/user.Controller/loginUser.controller.js';
import { getAllUsers } from '../controllers/user.Controller/getAllUsers.controller.js';
import { getUserById } from '../controllers/user.Controller/getSingleUser.controller.js';
import { deleteUser } from '../controllers/user.Controller/deleteUser.controller.js';

const router = express.Router();


router.post('/',createUser)
router.post('/login',loginUser)
router.get('/',getAllUsers)
router.get('/:id',getUserById)
router.delete('/:id',deleteUser)


export default router;
