import asyncHandler from "express-async-handler";
import prisma from "../../prisma/client.js";



/**
 * @openapi
 * /api/categories/{id}:
 *   put:
 *     tags:
 *       - Categories
 *     summary: Update a category.
 *     description: Update the details of an existing category. Only the owner of the category can perform this action.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the category to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Category Name"
 *     responses:
 *       200:
 *         description: Successfully updated the category.
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
 *                       example: "Updated Category Name"
 *                 message:
 *                   type: string
 *                   example: "Category updated successfully"
 *       400:
 *         description: Invalid request body.
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
 *                   example: "Invalid request body"
 *       403:
 *         description: Unauthorized to update the category.
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
 *                   example: "You are not permitted to update this category"
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
 *                   example: "Category not found"
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
 *                   example: "Internal server error"
 */


export const updateCategory = asyncHandler(async(req,res)=>{

    const {id} = req.params;
    const user_id= req?.user?.id

    const allowedUpdates=['name']


    // we preventing invalid request from the body,then stored the allowed in an object and then check if the data object is empty
    if(!Object.keys(req?.body).length ){
        res.status(400)
        throw new Error(ErrorCode.INVALID_REQUEST_BODY)
       }

       const data ={}
       for (const  key of allowedUpdates){
        if(req?.body?.hasOwnProperty(key)){
          data[key] = req.body[key]
        }
       }

       if(!Object.keys(data).length ){
        res.status(400)
        throw new Error(ErrorCode.INVALID_REQUEST_BODY)
       }

       const category = await prisma.category.findUnique({
        where:{
            id
        },
        
       })

       if(!category){
        res.status(404)
        throw new Error('Category not found')
       }

       if(category.user_id !== user_id){
        res.status(403)
        throw new Error('You are not permitted to update this category')
       }

       const updateCategory = await prisma.category.update({
        where:{
            id
        },
        data:data,
       })

       res.status(200).json({
        success:true,
        data:updateCategory,
        message:"Category updated successfully"
       })

})