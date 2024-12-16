import asyncHandler from "express-async-handler"
import prisma from "../../prisma/client.js";
/**
 * @openapi
 * /api/addresses/{addressId}:
 *   get:
 *     tags:
 *       - Addresses
 *     summary: Get a single address by address ID
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the address to retrieve
 *     responses:
 *       200:
 *         description: Address retrieved successfully.
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
 *                   description: The address object.
 *       401:
 *         description: Unauthorized - User needs to be authenticated.
 *       404:
 *         description: Not found - Address not found.
 *       500:
 *         description: Internal server error - Unable to retrieve address.
 */
export const getAddressById = asyncHandler(async(req,res)=>{

    const {id} = req.params;

    const address = await prisma.address.findUnique({
        where:{
            id
        }
    })

    if(!address){
        throw new Error(`Address with id ${id} not found`)
    }

    res.status(200).json({
        success:true,
        error:false,
        data:address,
        message:`Address with ${id} fetched successfully`
    })

})