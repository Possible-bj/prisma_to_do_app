
import asyncHandler from "express-async-handler"
import prisma from "../../prisma/client.js";
import { ErrorCode } from "../../utils/Error/Error.js";



/**
 * @openapi
 * /api/addresses/{id}:
 *   put:
 *     tags:
 *       - Addresses
 *     summary: Update an existing address.
 *     description: Update an address by its unique ID. Only authorized users can update their own addresses.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique ID of the address to update.
 *         schema:
 *           type: string
 *           example: "address-id-123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *                 example: "123 Main St"
 *               city:
 *                 type: string
 *                 example: "New York"
 *               state:
 *                 type: string
 *                 example: "NY"
 *               zip:
 *                 type: string
 *                 example: "10001"
 *               country:
 *                 type: string
 *                 example: "USA"
 *     responses:
 *       200:
 *         description: Address updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "address-id-123"
 *                     street:
 *                       type: string
 *                       example: "123 Main St"
 *                     city:
 *                       type: string
 *                       example: "New York"
 *                     state:
 *                       type: string
 *                       example: "NY"
 *                     zip:
 *                       type: string
 *                       example: "10001"
 *                     country:
 *                       type: string
 *                       example: "USA"
 *                     user_id:
 *                       type: string
 *                       example: "user-id-456"
 *                 message:
 *                   type: string
 *                   example: "Address updated successfully."
 *       400:
 *         description: Invalid request body or no updatable fields provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Invalid request body."
 *       401:
 *         description: Unauthorized - User does not have permission to update this address.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Unauthorized."
 *       404:
 *         description: Address not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "No Address found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */



export const updateAddress = asyncHandler(async(req,res)=>{

    const {id} =req.params;
    const user_id = req?.user?.id

    const allowedUpdates = ['street','city','state','zip','country']

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

    const address = await prisma.address.findUnique({
        where:{
            id
        }
    })

    if(!address) {
        throw new Error('No Address found ')
    }


    if(address.user_id !== user_id){
        throw new Error('You are not allowed to edit this address')
    }

    const updateAddress = await prisma.address.update({
        where:{
            id
        },
        data: data
    })


    res.status(200).json({
        status:true,
        data: updateAddress,
        message:'Address updated successfully'
    },
)
    

})