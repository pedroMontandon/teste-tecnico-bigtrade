import { Request, Response } from 'express';
import UserService from '../services/UserService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class UserController {
  constructor(private userService = new UserService()) {}
  
  async create(req: Request, res: Response) {
    const user = req.body;
    const { status, data } = await this.userService.create(user);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;
    const { status, data } = await this.userService.findById(id);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { user } = req.body;
    const { status, data } = await this.userService.update(id, user);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { status, data } = await this.userService.delete(id);
    return res.status(mapStatusHTTP(status)).json(data);
  }
}