import { Request, Response, NextFunction } from 'express';

export default class ErrorMiddleware {
  static handleErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    const { message } = err;
    return res.status(500).json({ message });
  }    
}