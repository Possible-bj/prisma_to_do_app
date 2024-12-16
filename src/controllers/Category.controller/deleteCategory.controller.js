import asyncHandler from "express-async-handler";
import prisma from "../../prisma/client.js";


/**
 * @openapi
 * /api/categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Delete a category.
 *     description: Deletes a category by its ID if the authenticated user owns the category.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the category to delete.
 *         example: "category-id-123"
 *     responses:
 *       200:
 *         description: Category deleted successfully.
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
 *                   example: "Category deleted successfully"
 *       401:
 *         description: Unauthorized - User does not have permission to delete this category.
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
 *                   example: "You are not permitted to delete this category."
 *       404:
 *         description: Category not found.
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
 *                   example: "Category with id category-id-123 not found."
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


export const deleteCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const user_id = req?.user?.id;


    const category = await prisma.category.findUnique({
        where:{
            id
        }
    })

    if(!category){
        res.status(404)
        throw new Error(`Category with id ${id} not found`)
    }


    if(category.user_id !==user_id){
        throw new Error('You are not permitted to delete this category')
    }

    const deletedCategory = await prisma.category.delete({
        where:{
            id
        }
    })

    res.status(200).json({
        success:true,
        error:false,
        data:deletedCategory,
        message:'Category deleted successfully'
    })

})