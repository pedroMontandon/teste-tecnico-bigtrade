import { NextFunction, Request, Response } from 'express';
import JwtUtils from '../utils/JwtUtils';

export default class TokenValidations {
  private static jwtUtils = new JwtUtils();

  static validateToken(req: Request, res: Response, next: NextFunction): Response | void {
    const { authorization } = req.headers;
    try { 
      if (!authorization) return res.status(401).json({ message: 'Please, sign in' });
      TokenValidations.jwtUtils.verify(authorization as string);
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Expired or invalid token' });
    }
  }
}