import express from 'express';
import { createCategory } from '../controllers/Category.controller/createCategory.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { deleteCategory } from '../controllers/Category.controller/deleteCategory.controller.js';
import { getAllCategory } from '../controllers/Category.controller/getAllCategory.controller.js';
import { getSingleCategory } from '../controllers/Category.controller/getSingleCategory.controller.js';
import { updateCategory } from '../controllers/Category.controller/updateCategory.controller.js';
const router = express.Router();   

router.post('/',protect,createCategory)
router.delete('/:id',protect,deleteCategory)
router.post('/get',getAllCategory)
router.get('/:id',getSingleCategory)
router.put('/:id',protect,updateCategory)



export default router;