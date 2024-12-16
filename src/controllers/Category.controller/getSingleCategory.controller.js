import asyncHandler from "express-async-handler";
import prisma from "../../prisma/client.js";

/**
 * @openapi
 * /api/categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get a single category by ID.
 *     description: Retrieve a single category's details by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the category.
 *     responses:
 *       200:
 *         description: Successfully retrieved the category.
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
 *                     id:
 *                       type: string
 *                       example: "category-id-123"
 *                     name:
 *                       type: string
 *                       example: "Electronics"
 *                 message:
 *                   type: string
 *                   example: "Category with category-id-123 fetched successfully"
 *       404:
 *         description: Category not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Category with id category-id-123 not found"
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
 *                   type: string
 *                   example: "Internal server error."
 */



export const getSingleCategory = asyncHandler(async(req,res)=>{

    const {id} = req.params;


    const category = await prisma.category.findUnique({
        where:{id}
    })

    if(!category){
        res.status(404)
        throw new Error(`Category with id ${id} not found`)
    }
    res.status(200).json({
        success:true,
        data:category,
        message:`Category with ${id} fetched successfully`
    })
})
