import asyncHandler from 'express-async-handler'
import prisma from '../../prisma/client.js';
import { ErrorCode } from '../../utils/Error/Error.js';

/**
 * @openapi
 * /api/todos/{id}:
 *   put:
 *     tags:
 *       - Todos
 *     summary: Update a Todo
 *     description: Update specific fields of a Todo by its ID. Only the owner of the Todo can perform this operation.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the Todo to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the Todo.
 *                 example: "Buy Groceries"
 *               description:
 *                 type: string
 *                 description: The description of the Todo.
 *                 example: "Groceries are special slakes"
 *               completed:
 *                 type: boolean
 *                 description: The completion status of the Todo.
 *                 example: true
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 description: Custom creation date.
 *                 example: "2024-12-03T12:00:00Z"
 *               updated_at:
 *                 type: string
 *                 format: date-time
 *                 description: Custom updated date.
 *                 example: "2024-12-03T14:00:00Z"
 *     responses:
 *       200:
 *         description: Todo updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     updateTodo:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: The ID of the updated Todo.
 *                         name:
 *                           type: string
 *                           description: The updated name of the Todo.
 *                         description:
 *                           type: string
 *                           description: The updated description of the Todo.
 *                         completed:
 *                           type: boolean
 *                           description: The updated completion status of the Todo.
 *                         user_id:
 *                           type: string
 *                           description: The ID of the user associated with the Todo.
 *                 message:
 *                   type: string
 *                   example: "Todo updated successfully"
 *       400:
 *         description: Invalid request body or invalid fields in the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid request body"
 *       403:
 *         description: Unauthorized access.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "You are not authorized to update this Todo"
 *       404:
 *         description: Todo not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Todo not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 *     security:
 *       - bearerAuth: []
 */


export const  updateTodo = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const user_id = req?.user?.id

    const allowedUpdates= [    
        "name" ,          
        "description" ,   
        "completed"     
     ]

    //  verifies the entire body request is empty...it dosent proceed if the body is empty

     if(!Object.keys(req?.body).length ){
        res.status(400)
        throw new Error(ErrorCode.INVALID_REQUEST_BODY)
       }
  
    //    this prevents invalid fields 
       const data ={}
       for (const  key of allowedUpdates){
        if(req?.body?.hasOwnProperty(key)){
          data[key] = req.body[key]
        }
       }
        //  this checks the data object if nothing is inside
       if(!Object.keys(data).length ){
        res.status(400)
        throw new Error(ErrorCode.INVALID_REQUEST_BODY)
       }

    const todo = await prisma.todo.findUnique({
        where:{
            id
        }
    })

    if(!todo){
        throw new Error("Todo not found")
    }

    if(todo.user_id !== user_id){
        throw new Error(ErrorCode.UNAUTHORIZED)
    }

   const updateTodo= await prisma.todo.update({
        where:{
            id,
            data:data
        },
    })

    res.status(200).json({
        success:true,
        data: updateTodo,
        message:"Todo updated successfully"
        
    })
 })
