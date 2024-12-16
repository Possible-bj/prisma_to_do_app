import asyncHandler from "express-async-handler";
import validator from "../../services/validationService.js"
import prisma from "../../prisma/client.js";



/**
 * @openapi
 * /api/categories:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Create a new category.
 *     description: Allows authenticated users to create a new category.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category.
 *                 example: "Electronics"
 *     responses:
 *       201:
 *         description: Category created successfully.
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
 *                     id:
 *                       type: string
 *                       example: "category-id-123"
 *                     name:
 *                       type: string
 *                       example: "Electronics"
 *                     user_id:
 *                       type: string
 *                       example: "user-id-456"
 *                 message:
 *                   type: string
 *                   example: "Category created successfully"
 *       400:
 *         description: Validation error or missing required fields.
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
 *                   example: "Validation error: 'name' is required."
 *       401:
 *         description: Unauthorized - User must be logged in to create a category.
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
 *                   example: "Unauthorized."
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
 *                   example: "Internal server error."
 */


export const createCategory = asyncHandler(async(req,res)=>{

    const validation = await validator.validateObject({
        name :"string|required",
    },{...req.body})

    if(validation.error){
        res.status(403).json(validation);
        return;
    }

    const {name} = req.body;
    const user_id = req?.user?.id;

    const category = await prisma.category.create({
        data:{
            name,
            user_id,
        }
    })

    res.status(201).json({
        error:false,
        data:category,
        message:"Category created successfully"
    })


})