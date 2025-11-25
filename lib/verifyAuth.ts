// lib/verifyAuth.ts
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  id: string;
  username: string;
}

export function verifyAuth(token: string): AuthPayload | null {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      username: string;
    };

    return {
      id: payload.userId,
      username: payload.username,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return null;
  }
}
