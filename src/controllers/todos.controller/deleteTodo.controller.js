import asyncHandler from "express-async-handler"
import prisma from "../../prisma/client.js";
import { ErrorCode } from "../../utils/Error/Error.js";

/**
 * @openapi
 * /api/todos/{id}:
 *   delete:
 *     tags:
 *       - Todos
 *     summary: Delete a Todo
 *     description: Delete a Todo by its ID. Only the owner of the Todo can perform this operation.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the Todo to delete.
 *     responses:
 *       200:
 *         description: Todo deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Todo deleted successfully"
 *       403:
 *         description: Unauthorized access or Todo not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "You are not authorized to delete this Todo"
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
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 *     security:
 *       - bearerAuth: []
 */


export const deleteTodo = asyncHandler(async(req,res)=>{
    const {id}= req.params;
    const user_id = req?.user?.id;

   
    const todo = await prisma.todo.findUnique({
        where:{
            id,
        }
    })

    if(!todo){
        res.status(403)
        throw new Error('Todo not found')
    }
    // if the user_id in todo is thesame with logged in user id
    // -check if the user_id that is attached to the todo while i was creating it is thesame with user_id of the logged in user

    if(todo.user_id !== user_id){
        throw new Error("You are not Authorized to delete this todo")
    }
   const deletedTodo= await prisma.todo.delete({
        where:{id}
    })

    res.status(200).json({
        success:true,
        data:deletedTodo,  
        error:false,  
        message:'Todo deleted successfully'
    })
 })



