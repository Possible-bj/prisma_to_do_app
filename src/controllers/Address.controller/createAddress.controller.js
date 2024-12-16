import asynchHandler from "express-async-handler"
import validator from "../../services/validationService.js"
import prisma from "../../prisma/client.js"


/**
 * @openapi
 * /api/addresses:
 *   post:
 *     tags:
 *       - Addresses
 *     summary: Create or update a user's address
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *                 description: The street of the address.
 *                 example: "123 Main St"
 *               city:
 *                 type: string
 *                 description: The city of the address.
 *                 example: "Los Angeles"
 *               state:
 *                 type: string
 *                 description: The state of the address.
 *                 example: "California"
 *               zip:
 *                 type: string
 *                 description: The postal code of the address.
 *                 example: "90001"
 *               country:
 *                 type: string
 *                 description: The country of the address.
 *                 example: "USA"
 *     responses:
 *       200:
 *         description: Address created or updated successfully.
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
 *                       description: The unique ID of the address.
 *                       example: "address-id-123"
 *                     street:
 *                       type: string
 *                       example: "123 Main St"
 *                     city:
 *                       type: string
 *                       example: "Los Angeles"
 *                     state:
 *                       type: string
 *                       example: "California"
 *                     zip:
 *                       type: string
 *                       example: "90001"
 *                     country:
 *                       type: string
 *                       example: "USA"
 *                     user_id:
 *                       type: string
 *                       description: The ID of the user associated with the address.
 *                       example: "user-id-456"
 *                     current:
 *                       type: boolean
 *                       description: Indicates if this is the user's current address.
 *                       example: true
 *                 message:
 *                   type: string
 *                   example: "New address created successfully"
 *       400:
 *         description: Invalid request due to validation errors.
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
 *                   example: "Invalid Request"
 *       401:
 *         description: Unauthorized access.
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
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error - Failed to create or update the address.
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


export const createAddress = asynchHandler(async(req,res)=>{

    const validation = await validator.validateObject({

        street : "string|required",
        city  : "string|required",
        state : "string|required",
        zip : "string|required",
        country : "string|required",


    },{...req.body})
    if(validation.error){
        res.status(403).json(validation);
        return;
    }

    const {street,city,state,zip,country} = req.body;
    const user_id = req?.user?.id;

    // Before you create a  new adress please check if the user have an existing address before if the user have please just
    // update the the address to the new one becaue the user might change their address from time to time
    // so to avoid duplicate address we will create a new one only if the user have no address or the current address is false


    // If you only used current: true, the query might return addresses
    // from other users if they also have a current address marked as true, which is not desired

    const existingAddress =await prisma.address.findFirst({
        where:{
            user_id,
            current:true,
        }
    })
    
   
    if(existingAddress){
        // If the user have an existing address then update the address
         await prisma.address.update({
            where:{
                // This tells Prisma to find the address with id = 1 in the database and update the existing one.
                id:existingAddress.id,
                
            },
           data:{ current:false}
        //    inside the data i only want to update the current so no need to include all the rest datas
           
        })
    }

    const newAdress =await prisma.address.create({
        data:{
            street,
            city,
            state,
            zip,
            country,
            user_id,
            current:true
        }

    })

    res.status(200).json({
        error:false,
        data:newAdress,
        message:'New address created successfully'
    })



})