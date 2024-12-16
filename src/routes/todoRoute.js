import express from 'express';
import { createTodo } from '../controllers/todos.controller/createTodo.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { getAllTodos } from '../controllers/todos.controller/getAllTodo.controller.js';
import { deleteTodo } from '../controllers/todos.controller/deleteTodo.controller.js';
import { updateTodo } from '../controllers/todos.controller/updateTodo.controller.js';
import { getSingleTodo } from '../controllers/todos.controller/getSingle.controller.js';

const router = express.Router();

router.post('/',protect,createTodo)
router.post('/get',protect,getAllTodos)
router.delete('/:id',protect,deleteTodo)
router.put('/:id',protect,updateTodo)
router.get('/:id',protect,getSingleTodo)

export default router