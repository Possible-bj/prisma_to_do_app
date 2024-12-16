import asyncHandler from "express-async-handler"
import validator from "../../services/validationService.js"
import prisma from "../../prisma/client.js"
import bcrypt from "bcryptjs"
import TokenService from "../../utils/Tokens/TokenService.js"

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Log in a user
 *     description: Validates user credentials, checks if the user exists, compares passwords, and generates access and refresh tokens.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: User logged in successfully.
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
 *                         email:
 *                           type: string
 *                           format: email
 *                           description: The email of the user.
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           description: The date and time the user was created.
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           description: The date and time the user was last updated.
 *                     accessToken:
 *                       type: string
 *                       description: The access token for authenticated requests.
 *                     refreshToken:
 *                       type: string
 *                       description: The refresh token for renewing access tokens.
 *                 message:
 *                   type: string
 *                   example: "User logged in successfully."
 *       400:
 *         description: Validation error or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error: email and password are required."
 *       401:
 *         description: Invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials."
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
 *                   example: "Failed to log in user."
 */


export const loginUser = asyncHandler(async(req,res)=>{
    const validation = await validator.validateObject({
        email : "string|required",
        password:"string|required"

    },{...req.body})

    if(validation.error){
        res.status(400).json({message: validation.error})
        return;
    }
   
    const {email, password} = req.body
    const userExist = await prisma.user.findUnique({
        where:{
            email,
        }
    })

    if(!userExist){
        res.status(404)
        throw new Error('User not found')
    }

    // Bro the user used here is not from the database oo..its from the variable you declare to find unique..
    // u did const userExist so u must check with userExist like that
    const isMatch = await bcrypt.compare(password,userExist.password);
    if(!isMatch){
        res.status(401)
        throw new Error('Invalid credentials')
    }

    const tokenService = new TokenService();
    const accessToken = await tokenService.generateAccessToken(userExist?.id);
    const refreshToken = await tokenService.generateRefreshToken(userExist?.id);

    res.status(200).json({
        error:false,
        data:userExist,
            accessToken,
            refreshToken,
        
        message: 'User logged in successfully'
    })

})