import {  ErrorCode, getErrorCode } from "../utils/Error/Error.js";
import TokenService from "../utils/Tokens/TokenService.js";


const protect = async (
  req,
  res,
  next
) => {
  let token;

  try {
    const tokenService = new TokenService();
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      const user =await tokenService.verifyAccessToken(token);
      req.user = user;

      next();
    }
    if (!token) {
      res.status(401);
      throw new Error(ErrorCode.TOKEN_EXPIRED);
    }
  } catch (error) {
    res.status(401);
    res.json({
      error: true,
      code: getErrorCode(error.message),
      messsage: error.message,
    });
  }
};

export { protect };
