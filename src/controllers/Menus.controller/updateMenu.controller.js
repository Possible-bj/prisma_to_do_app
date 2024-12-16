import asyncHandler from "express-async-handler";
import prisma from "../../prisma/client.js";



export const updateMenu = asyncHandler(async(req,res)=>{
    const {id}=  req.params;
    const user_id = req?.user?.id;

    const allowedUpdates = ['name', 'description', 'price', 'category_id']

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

    const updateMenu = await prisma.menu.update({
        where:{
            id
        },
        data:data
    })

    res.status(200).json({
        success: true,
        data: updateMenu,  
        error: false, 
        message: "Menu updated  successfully"
    })

})