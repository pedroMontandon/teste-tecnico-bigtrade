import { NextFunction, Request, Response } from 'express';

export default class PostValidations {
  private static titleLength = 3;
  private static contentLength = 5;

  static validateCreate(req: Request, res: Response, next: NextFunction): Response | void {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (title.length < PostValidations.titleLength) {
      return res.status(400).json({ message: 'Invalid title length' });
    }
    if (content.length < PostValidations.contentLength) {
      return res.status(400).json({ message: 'Invalid content length' });
    }
    return next();
  }

  static validateId(req: Request, res: Response, next: NextFunction): Response | void {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ message: 'Invalid id' });
    return next();
  }
}