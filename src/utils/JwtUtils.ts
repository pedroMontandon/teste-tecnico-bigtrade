import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default class JwtUtils {
  private jwtSecret = process.env.JWT_SECRET || 'secret';

  sign(payload: { id: string, email: string, role: string }): string {
    return jwt.sign(payload, this.jwtSecret);
  }

  verify(token: string): { id: string, email: string, role: string } {
    const bearerNToken = token.split(' ');
    return jwt.verify(bearerNToken[1], this.jwtSecret) as { id: string, email: string, role: string };
  }

  decode(token: string): { id: string, email: string, role: string } {
    const bearerNToken = token.split(' ');
    return jwt.decode(bearerNToken[1]) as { id: string, email: string, role: string };
  }

  isAdmin(token: string): boolean {
    return this.decode(token).role === 'admin';
  }
}