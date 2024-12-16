import express from 'express';
import { createMenuOptions } from '../controllers/MenuOptions.controller/createMenuOption.controller.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();


router.post('/',protect,createMenuOptions)


export default router;