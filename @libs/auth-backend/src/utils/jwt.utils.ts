import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export function generateTokens(
  payload: JwtPayload,
  jwtSecret: string,
  jwtRefreshSecret: string,
): TokenPair {
  const accessToken = jwt.sign(payload, jwtSecret, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, jwtRefreshSecret, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string, jwtSecret: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string, jwtRefreshSecret: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, jwtRefreshSecret) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}
