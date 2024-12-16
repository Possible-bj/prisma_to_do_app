
import asyncHandler from "express-async-handler"
import prisma from "../../prisma/client.js"



/**
 * @openapi
 * /api/todos/get:
 *   post:
 *     tags:
 *       - Todos
 *     summary: Get all Todos
 *     description: Retrieve all Todos with support for filtering, sorting, and pagination.
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: name:asc
 *         description: Sort the Todos by a specific field and order (e.g., "name:asc" or "id:desc").
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           example: 10
 *         description: The number of items to retrieve per page.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           example: 1
 *         description: The page number to retrieve.
 *       - in: query
 *         name: filters
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: Buy Groceries
 *             description:
 *               type: string
 *               example: Milk, Bread, Eggs
 *             user_id:
 *               type: string
 *               example: user-id-123
 *             completed:
 *               type: boolean
 *               example: false
 *         description: Filters to apply for retrieving Todos.
 *     responses:
 *       200:
 *         description: A list of Todos.
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique identifier of the Todo.
 *                       name:
 *                         type: string
 *                         description: The name of the Todo.
 *                       description:
 *                         type: string
 *                         description: The description of the Todo.
 *                       completed:
 *                         type: boolean
 *                         description: The completion status of the Todo.
 *                       user_id:
 *                         type: string
 *                         description: The ID of the user associated with the Todo.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The creation date of the Todo.
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The last update date of the Todo.
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       description: The total number of items.
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages.
 *                       example: 3
 *                     currentPage:
 *                       type: integer
 *                       description: The current page number.
 *                       example: 1
 *       400:
 *         description: Bad request. Invalid parameters or filters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve Todos."
 */


export const getAllTodos = asyncHandler(async (req, res) => {
  const { sort, page = 1, limit = 10 } = req.query;

  // Default page and limit numbers
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const user_id = req?.user?.id;

  // Define allowed filters and apply them from request body

  // If the Todos are already scoped to the authenticated user (i.e., the API only returns Todos that belong to the currently logged-in user), then filtering by user_id may be redundant. The application might already ensure that users can only access their own Todos. thats why Boss asked you not to filter by user_id
  const allowedFilters = [
    "name",
    "description",
    "completed",
    "created_at",
    "updated_at"
  ];

  // checks the user_id attached to all todos and only returns for those that belongs to the login user
  const filters = {user_id : user_id};
  for (const filter of allowedFilters) {
    if (req.body && req.body[filter]) {
      filters[filter] = req.body[filter];
    }
  }

  // Define allowed sorting fields and process sort query
  const allowedSorts = [
    "id",
    "name",
    "created_at",
    "updated_at",
  ];
  const orderBy = [];

  // Handle multi-field sorting
  if (sort) {
    const sortFields = Array.isArray(sort) ? sort : [sort];
    for (const field of sortFields) {
      const [sortField, sortOrder] = field.split(":");
      if (allowedSorts.includes(sortField)) {
        orderBy.push({
          [sortField]: ["asc", "desc"].includes(sortOrder)
            ? sortOrder
            : "asc",
        });
      }
    }
  }

  // Fetch menus and calculate pagination
  const todos = await prisma.todo.findMany({
    where: filters,
    skip,
    take: limitNumber,
    orderBy,
  });

  const totalItems = await prisma.todo.count({
    where: filters,
  });

  const totalPages = Math.ceil(totalItems / limitNumber);

  res.status(200).json({
    success: true,
    error: false,
    data: todos,
    pagination: {
      totalItems,
      totalPages,
      currentPage: pageNumber,
    },
  });
});
