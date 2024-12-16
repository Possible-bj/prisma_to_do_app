
import asynchHandler from 'express-async-handler'
import prisma from '../../prisma/client.js';



/**
 * @openapi
 * /api/addresses/get:
 *   post:
 *     tags:
 *       - Addresses
 *     summary: Get all addresses with optional filtering, sorting, and pagination.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             example: city:asc
 *           description: |
 *             Sort addresses by multiple fields. Each sort field should be in the format field:order, where the field can be id, street, city, state, zip, country, or current, and the order can be asc or desc.
 *             Multiple sort fields can be specified by repeating the sort parameter, e.g., ?sort=city:asc&sort=state:desc.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *                 description: Filter by street name
 *               city:
 *                 type: string
 *                 description: Filter by city
 *               state:
 *                 type: string
 *                 description: Filter by state
 *               zip:
 *                 type: string
 *                 description: Filter by zip code
 *               country:
 *                 type: string
 *                 description: Filter by country
 *               user_id:
 *                 type: string
 *                 description: Filter by user ID
 *               current:
 *                 type: boolean
 *                 description: Filter by current address status
 *     responses:
 *       200:
 *         description: List of addresses retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       street:
 *                         type: string
 *                       city:
 *                         type: string
 *                       state:
 *                         type: string
 *                       zip:
 *                         type: string
 *                       country:
 *                         type: string
 *                       current:
 *                         type: boolean
 *                       user_id:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *       401:
 *         description: Unauthorized - User needs to be authenticated.
 *       404:
 *         description: Not found - No addresses found for the user.
 *       500:
 *         description: Internal server error - Unable to retrieve addresses.
*/

export const getAllAddresses = asynchHandler(async(req,res)=>{
const {page= 1,limit=10,sort}= req.query;
const pageNumber= parseInt(page, 10)||1
    const limitNumber= parseInt(limit, 10)||10
    const skip= (pageNumber-1)*limitNumber

    const allowedFilters = ["street","city","state","zip","country","user_id"]
    const filters = {}
    for (const filter of allowedFilters) {
        if (req.body?.[filter] !== undefined) {
          filters[filter] = req.body[filter];
        }
      }


      const allowedSorts = ["id", "street", "city", "state", "zip", "country", "current"];
      const orderBy = []

      if (sort) {
        const sortFields = Array.isArray(sort) ? sort : [sort];
        for (const field of sortFields) {
          const [sortField, sortOrder] = field.split(":");
          if (allowedSorts.includes(sortField)) {
            orderBy.push({
              [sortField]: ["asc", "desc"].includes(sortOrder) ? sortOrder : "asc",
            });
          }
        }
      }


      const addresses = await prisma.address.findMany({
        where: filters,
        skip,
        take: limitNumber,
        orderBy,
      });

      const totalItems = await prisma.address.count({
        where: filters,
      });
  
      const totalPages = Math.ceil(totalItems / limitNumber);
  
      res.status(200).json({
        success: true,
        data: addresses,
        pagination: {
          totalItems,
          totalPages,
          currentPage: pageNumber,
        },
      });


})