import { NextFunction, Request, Response } from 'express';

export default class UserValidations {
  private static passwordLength = 6;
  private static emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  static validateSignUp(req: Request, res: Response, next: NextFunction): Response | void {
    const { displayName, password, email } = req.body;
    if (!displayName || !password || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!UserValidations.emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    if (password.length < UserValidations.passwordLength) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    return next();
  }

  static validateId(req: Request, res: Response, next: NextFunction): Response | void {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing required fields' });
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ message: 'Invalid id' });
    return next();
  }
}