import asyncHandler from "express-async-handler";
import prisma from "../../prisma/client.js";

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Fetches a list of all registered users. Returns a 404 error if no users are found.
 *     responses:
 *       200:
 *         description: Users fetched successfully.
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
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The unique identifier of the user.
 *                           username:
 *                             type: string
 *                             description: The username of the user.
 *                           email:
 *                             type: string
 *                             format: email
 *                             description: The email address of the user.
 *                           first_name:
 *                             type: string
 *                             description: The first name of the user.
 *                           last_name:
 *                             type: string
 *                             description: The last name of the user.
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The date and time the user was created.
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: The date and time the user was last updated.
 *                 message:
 *                   type: string
 *                   example: "Users fetched successfully."
 *       404:
 *         description: No users found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No users found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch users."
 */

export const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await prisma.user.findMany({});

  if (!users) {
    res.status(404);
    throw new Error("No users found");
  }

  res.status(200).json({
    errror: false,
    data: {
      users,
    },
    message: "Users fetched successfully",
  });
});
