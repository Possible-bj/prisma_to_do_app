import asyncHandler from "express-async-handler";
import prisma from "../../prisma/client.js";


/**
 * @openapi
 * /api/menus/{id}:
 *   delete:
 *     tags:
 *       - Menus
 *     summary: Delete a menu item by its ID.
 *     description: Deletes a specific menu item if it exists and the user is authorized to perform the action.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the menu to delete.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Menu deleted successfully.
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
 *                       example: "menu-id-123"
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
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Menu deleted successfully."
 *       403:
 *         description: Unauthorized to delete the menu item.
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
 *                   example: "You are not permitted to delete this menu."
 *       404:
 *         description: Menu not found.
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
 *                   example: "Menu not found for menu-id-123."
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
 *                   example: "Internal server error."
 */


export const deleteMenu = asyncHandler(async(req,res)=>{
    const {id}=  req.params;
    const user_id = req?.user?.id;


    const menu = await prisma.menu.findUnique({
        where:{
            id
        }
    })

    if(!menu){
        res.status(404)
        throw new Error(`Menu not found for ${id}`)
    }

    if(menu.user_id !== user_id){
        res.status(403)
        throw new Error('You are not permitted to delete this menu')
    }

    const deleteMenu = await prisma.menu.delete({
        where:{
            id
        }
    })

    res.status(200).json({
        success: true,
        data: deleteMenu,  
        error: false, 
        message: "Menu deleted successfully"
    })

})