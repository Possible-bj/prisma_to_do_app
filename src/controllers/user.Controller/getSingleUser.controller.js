import asyncHandler from "express-async-handler";
import prisma from "../../prisma/client.js";

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Fetches a user by their unique ID. Returns a 404 error if the user is not found.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user to retrieve.
 *     responses:
 *       200:
 *         description: User retrieved successfully.
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: The unique identifier of the user.
 *                         username:
 *                           type: string
 *                           description: The username of the user.
 *                         email:
 *                           type: string
 *                           format: email
 *                           description: The email address of the user.
 *                         first_name:
 *                           type: string
 *                           description: The first name of the user.
 *                         last_name:
 *                           type: string
 *                           description: The last name of the user.
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           description: The date and time the user was created.
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           description: The date and time the user was last updated.
 *                 message:
 *                   type: string
 *                   example: "User with {id} retrieved successfully."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve user."
 */


export const getUserById = asyncHandler(async(req,res)=>{

    const {id} = req.params;

    const user = await prisma.user.findUnique({
        where:{
            id,
        }
    })
    if(!user){
        res.status(404)
        throw new Error('User not found')
    }

    res.status(200).json({
        error:false,
        data:{
            user
        },
        message:`user with ${id} retrieved successfully`

    })

})