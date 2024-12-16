  import asyncHandler from "express-async-handler"
import prisma from "../../prisma/client.js";


/**
 * @openapi
 * /api/todos/{id}:
 *   get:
 *     tags:
 *       - Todos
 *     summary: Get a Single Todo
 *     description: Retrieve a specific Todo by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the Todo to retrieve.
 *     responses:
 *       200:
 *         description: Todo retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   properties:
 *                     todo:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: The ID of the Todo.
 *                         name:
 *                           type: string
 *                           description: The name of the Todo.
 *                         description:
 *                           type: string
 *                           description: The description of the Todo.
 *                         completed:
 *                           type: boolean
 *                           description: The completion status of the Todo.
 *                         user_id:
 *                           type: string
 *                           description: The ID of the user associated with the Todo.
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           description: The creation date of the Todo.
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           description: The last update date of the Todo.
 *                 message:
 *                   type: string
 *                   example: "Todo with id-123 fetched successfully"
 *       404:
 *         description: Todo not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
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
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 *     security:
 *       - bearerAuth: []
 */


export const getSingleTodo = asyncHandler(async(req,res)=>{

    const {id} =req.params;

    const todo = await prisma.todo.findUnique({
        where:{id}
    })

    if(!todo){
        res.status(404)
        throw new Error(`Todo with id ${id} not found`)
    }

    res.status(200).json({
        error:false,
        data: todo,
        message:`Todo with ${id} fetched successfully`
    })
    
})