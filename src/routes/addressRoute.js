import express from 'express';
import { createAddress } from '../controllers/Address.controller/createAddress.controller.js';
import {protect} from "../middleware/authMiddleware.js"
import { getAllAddresses } from '../controllers/Address.controller/getAllAddress.controller.js';
import { getAddressById } from '../controllers/Address.controller/getSingleAddress.controller.js';
import { deleteAddress } from '../controllers/Address.controller/deleteAddress.controller.js';
import { updateAddress } from '../controllers/Address.controller/updateAddress.controller.js';

const router = express.Router();

router.post('/',protect,createAddress)
router.post('/get',protect,getAllAddresses)
router.get('/:id',protect,getAddressById)
router.delete('/:id',protect,deleteAddress)
router.put('/:id',protect,updateAddress)

export default router
