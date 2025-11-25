import jwt from 'jsonwebtoken';

export function decodeUserFromToken(token: string) {
  try {
    return jwt.decode(token) as { userId: string; username: string } | null;
  } catch {
    return null;
  }
}
