import * as jwt from "jsonwebtoken";
import { IUseToken, JwtPayload } from "src/auth/jwt-payload.interface";

export const useToken = (token: string): IUseToken | string => {
  try {
    const secret = process.env.SECRETORPRIVATEKEY;
    if (!secret) throw new Error("SECRETORPRIVATEKEY is not defined in .env");

    const decoded = jwt.verify(token, secret) as JwtPayload;

    const currentDate = new Date().getTime() / 1000;
    const expiresDate = decoded.exp ?? 0;

    return {
      id: decoded.id,
      role: decoded.role,
      isExpired: +expiresDate <= +currentDate,
    };
  } catch (error) {
    return "Token is invalid or has been tampered with";
  }
};
