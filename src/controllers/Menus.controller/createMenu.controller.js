import asyncHandler from "express-async-handler"
import validator from "../../services/validationService.js"
import prisma from "../../prisma/client.js"


/**
 * @openapi
 * /api/menus:
 *   post:
 *     tags:
 *       - Menus
 *     summary: Create a new menu.
 *     description: Allows a user to create a new menu item associated with a specific category.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Grilled Chicken"
 *               price:
 *                 type: number
 *                 example: 12.99
 *               description:
 *                 type: string
 *                 example: "A delicious grilled chicken served with sides."
 *               category_id:
 *                 type: string
 *                 example: "category-id-123"
 *             required:
 *               - name
 *               - price
 *               - description
 *               - category_id
 *     responses:
 *       201:
 *         description: Successfully created a menu item.
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
 *                       example: "menu-id-456"
 *                     name:
 *                       type: string
 *                       example: "Grilled Chicken"
 *                     price:
 *                       type: number
 *                       example: 12.99
 *                     description:
 *                       type: string
 *                       example: "A delicious grilled chicken served with sides."
 *                     category_id:
 *                       type: string
 *                       example: "category-id-123"
 *                     user_id:
 *                       type: string
 *                       example: "user-id-789"
 *                 message:
 *                   type: string
 *                   example: "Menu created successfully"
 *       403:
 *         description: Validation error for request body.
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
 *                   example: "Validation error"
 *                 details:
 *                   type: object
 *                   example: {
 *                     name: "The name field is required",
 *                     price: "The price must be a number"
 *                   }
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
 *                   example: "Internal server error"
 */

export const createMenu =asyncHandler(async(req,res)=>{

    const validation = await validator.validateObject({
        name :"string|required",
        price :"numeric|required",
        description :"string|required",
        category_id :"string|required"


    },{...req.body})

    if(validation.error){
        res.status(403).json('fields error');
        return;
    }
    const {
        name,
        description,
        price,
        category_id,
      } = req.body;

    const user_id = req?.user?.id


    const menu = await prisma.menu.create({
        data:{
            name,
            price,
            description,
            category_id,
            user_id,
        }

    })

    res.status(201).json({
        error:false,
        data:menu,
        message:"Menu created successfully"
    })


})