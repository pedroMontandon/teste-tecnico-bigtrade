import { Request, Response } from 'express';
import PostService from '../services/PostService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class PostController {
  constructor(private postService = new PostService()) {}

  async create(req: Request, res: Response) {
    const post = req.body;
    const token = req.headers.authorization;
    const { status, data } = await this.postService.create(post, token!);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async findAll(_req: Request, res: Response) {
    const { status, data } = await this.postService.findAll();
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;
    const { status, data } = await this.postService.findById(id);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const post = req.body;
    const token = req.headers.authorization;
    const { status, data } = await this.postService.update(id, post, token!);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const token = req.headers.authorization;
    const { status, data } = await this.postService.delete(id, token!);
    return res.status(mapStatusHTTP(status)).json(data);
  }
}