import { Prisma } from "@prisma/client";
import { getErrorCode } from "../utils/Error/Error.js";
import { prismaErrorMessages } from "../utils/prisma/errorCodes.js";


const notFound = (
  req,
  res,
  next
) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (
  error,
  req,
  res,
  next
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
 

  let errorMessage = error.message;

  // Check for specific Prisma error message and extract readable part

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code && error.code in prismaErrorMessages) {
      errorMessage =
        prismaErrorMessages[error.code];

    }
    // Handle known Prisma errors
    res.json({
      error: true,
      message: `${errorMessage}`,
      stack: process.env.NODE_ENV === "production" ? null : error.stack,
    });
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    // Handle unknown Prisma errors
    res.json({
      error: true,
      message: `Prisma unknown request error: ${errorMessage}`,
      stack: process.env.NODE_ENV === "production" ? null : error.stack,
    });
  } else if (error instanceof Error) {
    // Handle generic errors
    res.json({
      error: true,
      message: errorMessage,
      code: getErrorCode(errorMessage),
      stack: process.env.NODE_ENV === "production" ? null : error.stack,
    });
  } else {
    // Handle unknown errors
    res.json({
      error: true,
      message: "An unexpected error occurred.",
      stack: process.env.NODE_ENV === "production" ? null : error,
    });
  }
};

export { notFound, errorHandler };
