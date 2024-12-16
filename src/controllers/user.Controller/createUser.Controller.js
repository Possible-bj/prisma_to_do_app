import asyncHandler from "express-async-handler"
import validator from "../../services/validationService.js"
import bcrypt from 'bcryptjs'
import TokenService from "../../utils/Tokens/TokenService.js"
import prisma  from "../../prisma/client.js"


/**
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     description: Validates user input, checks for existing users, hashes the password, registers a new user, and generates access and refresh tokens.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - first_name
 *               - last_name
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The unique username for the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *               first_name:
 *                 type: string
 *                 description: The user's first name.
 *               last_name:
 *                 type: string
 *                 description: The user's last name.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password (minimum 6 characters).
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the user.
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: The email of the user.
 *                     first_name:
 *                       type: string
 *                       description: The first name of the user.
 *                     last_name:
 *                       type: string
 *                       description: The last name of the user.
 *                     username:
 *                       type: string
 *                       description: The username of the user.
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 accessToken:
 *                   type: string
 *                   description: The access token for authenticated requests.
 *                 refreshToken:
 *                   type: string
 *                   description: The refresh token for renewing access tokens.
 *                 message:
 *                   type: string
 *                   example: "User registered successfully."
 *       400:
 *         description: Validation error or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error."
 *       409:
 *         description: User already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User already exists."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to register user."
 */





export const createUser = asyncHandler(async(req,res)=>{
    
    const validation = await validator.validateObject({
        username  :  "string|required",
        email  :  "required|string"  ,     
        first_name:  "string|required",
        last_name  :  "string|required",
        password  :  "string|required",
        
    }, {...req?.body})
    
    
    if(validation?.error){
        res.status(400).json({message: validation.error})
        return;
    }
    const { username, email, first_name, last_name, password } = req.body;
    const userExist = await prisma.user.findFirst({
        where :{
            OR:[
                { email},
                { username}
            ]
        }
    })

    if(userExist){

        throw new Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data:{
            email,
            first_name,
            last_name,
            password: hashedPassword,
            username
        }
    })

    if(!user){

        throw new Error('Failed to register user')

    }

    const tokenService = new TokenService()
    const accessToken = await tokenService.generateAccessToken(user?.id)
    const refreshToken = await tokenService.generateRefreshToken(user?.id)

    res.status(201).json({
        error:false,
        data:user,
            accessToken,
            refreshToken,
        
        status:true,
        message: 'User registered successfully'
    })


})


