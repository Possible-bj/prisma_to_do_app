import asyncHandler from "express-async-handler"
import { ErrorCode } from "../../utils/Error/Error.js";
import prisma from "../../prisma/client.js";



/**
 * @openapi
 * /api/addresses/{id}:
 *   delete:
 *     tags:
 *       - Addresses
 *     summary: Delete an address by ID for a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the address to delete
 *     responses:
 *       200:
 *         description: Address deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Address deleted successfully
 *       404:
 *         description: Address not found or does not belong to the user.
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
 *                   example: Address not found or does not belong to the user
 *       500:
 *         description: Internal server error - Unable to delete address.
 */

export const deleteAddress = asyncHandler(async(req,res)=>{

    const {id} = req.params;
    const user_id = req?.user?.id;

    if(!user_id){
        throw new Error(ErrorCode.UNAUTHORIZED)
    }
   
    // first check if the id you want to delete is matches the id in the database
    const address = await prisma.address.findUnique({
        where:{
            id
        }
    })

    if(!address){
        res.status(404)
        throw new Error('Address not found')
    }

    if(address.user_id !== user_id){
        throw new Error('you are not permitted to delete this address')
    }

    const deletedAddress = await prisma.address.delete({
        where:{
            id
        }
    })

    

    res.status(200).json({
        success:true,
        error:false,
        data:deletedAddress,
        message:`Address with ${id} deleted successfully`
    })

})