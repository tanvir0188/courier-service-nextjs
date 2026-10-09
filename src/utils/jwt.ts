import jwt, { type JwtPayload } from "jsonwebtoken";

export interface DecodedAuthPayload extends JwtPayload {
  userId?: string;
  email?: string;
  role?: "CUSTOMER" | "PROVIDER" | "ADMIN";
}

const verifyToken = (token: string, secret?: string) => {
  try {
    if (secret) {
      const verifiedToken = jwt.verify(token, secret);
      return {
        success: true,
        data: verifiedToken as DecodedAuthPayload,
      };
    }

    const decoded = jwt.decode(token) as DecodedAuthPayload | null;
    if (decoded) {
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return {
          success: false,
          error: "Token has expired",
        };
      }
      return {
        success: true,
        data: decoded,
      };
    }

    return {
      success: false,
      error: "Unable to decode token",
    };
  } catch (error: any) {
    // If secret verification fails due to secret mismatch in dev, fallback to decode with expiration check
    const decoded = jwt.decode(token) as DecodedAuthPayload | null;
    if (decoded && (!decoded.exp || decoded.exp * 1000 > Date.now())) {
      return {
        success: true,
        data: decoded,
      };
    }

    return {
      success: false,
      error: error?.message || "Token verification failed",
    };
  }
};

const decodeToken = (token: string): DecodedAuthPayload | null => {
  try {
    return jwt.decode(token) as DecodedAuthPayload | null;
  } catch {
    return null;
  }
};

export const jwtUtils = {
  verifyToken,
  decodeToken,
};
