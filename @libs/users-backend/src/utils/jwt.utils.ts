import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generate access and refresh tokens for a user
 */
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

/**
 * Verify and decode an access token
 */
export function verifyAccessToken(token: string, jwtSecret: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Verify and decode a refresh token
 */
export function verifyRefreshToken(token: string, jwtRefreshSecret: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, jwtRefreshSecret) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}
