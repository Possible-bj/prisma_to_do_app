import jwt from "jsonwebtoken";
import prisma from "../../prisma/client.js";



class TokenService {
  // Generates an access token
  generateAccessToken = async (id, expiresIn = "7d") => {
    const token = jwt.sign({ id }, `${process.env.JWT_ACCESS_TOKEN_SECRET}`, {
      expiresIn: expiresIn,
    });
    return token;
  };

  // Generates a refresh token
  generateRefreshToken = async (id, expiresIn = "1y") => {
    const token = jwt.sign({ id }, `${process.env.JWT_REFRESH_TOKEN_SECRET}`, {
      expiresIn: expiresIn,
    });
    return token;
  };

  // Verifies an access token
  verifyAccessToken = async (token) => {
    const result = jwt.verify(
      token,
      `${process.env.JWT_ACCESS_TOKEN_SECRET}`
    );
    return (await prisma.user.findUnique({
      where: { id: result?.id },
      
    })) ;
  };

  // Verifies a refresh token
  verifyRefreshToken = async (token) => {
    const result = jwt.verify(
      token,
      `${process.env.JWT_REFRESH_TOKEN_SECRET}`
    );
    return (await prisma.user.findUnique({
      where: { id: result?.id },
      
    })) 
  };
}

export default TokenService;
