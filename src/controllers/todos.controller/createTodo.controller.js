import asyncHandler from "express-async-handler";
import validator from "../../services/validationService.js"
import prisma from "../../prisma/client.js"    
import { ErrorCode } from "../../utils/Error/Error.js";


/**
 * @openapi
 * /api/todos:
 *   post:
 *     tags:
 *       - Todos
 *     summary: Create a new Todo
 *     description: Validates the input, checks if a Todo with the same name exists, and creates a new Todo in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the Todo item.
 *                 example: Buy Groceries
 *               description:
 *                 type: string
 *                 description: A description of the Todo item.
 *                 example: Milk, Bread, Eggs
 *               completed:
 *                 type: boolean
 *                 description: The completion status of the Todo item.
 *                 example: false

 *     responses:
 *       201:
 *         description: Todo created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     todo:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: The unique identifier of the Todo item.
 *                         name:
 *                           type: string
 *                           description: The name of the Todo item.
 *                         description:
 *                           type: string
 *                           description: The description of the Todo item.
 *                         completed:
 *                           type: boolean
 *                           description: The completion status of the Todo item.
 *                         user_id:
 *                           type: string
 *                           description: The user ID associated with the Todo item.
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           description: The creation date of the Todo item.
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           description: The last update date of the Todo item.
 *                 message:
 *                   type: string
 *                   example: "Todo created successfully."
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error: name and description are required."
 *       409:
 *         description: Todo already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Todo already exists."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to create Todo."
 */



export const createTodo =asyncHandler(async(req,res)=>{
    const validation = await validator.validateObject({
        name :"string|required",
        description :"string|required",
        completed : "boolean"
    },{...req.body}) 

    if(validation.error){
        res.status(400)
        throw new Error('validation error')
    }

    const {name,description,completed} = req.body;
    const user_id = req?.user?.id

    if(!user_id){
        throw new Error(ErrorCode.UNAUTHORIZED)
    }

    // any todo i create with a user attach the user_id so we know its thier own todo..

    const newTodo = await prisma.todo.create({
        data:{
             name,
            description,
            completed,
            user_id
        }
    })

    res.status(201).json({
        status:true,
        error:false,
        data: newTodo,
        message:"Todo created successfully"
    })

})