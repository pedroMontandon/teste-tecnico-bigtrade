import { NextFunction, Request, Response } from 'express';

export default class UserValidations {
  private static passwordLength = 6;
  private static emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private static idRegex = /^[0-9a-fA-F]{24}$/;

  static validateCreate(req: Request, res: Response, next: NextFunction): Response | void {
    const { displayName, password, email, role } = req.body;
    if (!displayName || !password || !email || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!UserValidations.emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    if (password.length < UserValidations.passwordLength) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    if (role !== 'admin' && role !== 'user') {
      return res.status(400).json({ message: 'Role must be either "admin" or "user"' });
    }
    return next();
  }

  static validateId(req: Request, res: Response, next: NextFunction): Response | void {
    const { id } = req.params;
    if (!id.match(UserValidations.idRegex)) return res.status(400).json({ message: 'Invalid id' });
    return next();
  }

  static validateLogin(req: Request, res: Response, next: NextFunction): Response | void {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing required fields' });
    if (!UserValidations.emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email address' });
    if (password.length < UserValidations.passwordLength) return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    return next();
  }
}