import UserModel from '../models/UserModel';
import { IUser } from '../types/IUser';
import { ServiceResponse } from '../types/ServiceResponseTypes';

class UserService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  async create(user: IUser): Promise<ServiceResponse< { message: string}>> {
    const existingUser = await this.userModel.findByEmail(user.email);
    if (existingUser) return { status: 'CONFLICT', data: { message: 'User already exists' } };
    await this.userModel.create(user);
    return { status: 'CREATED', data: { message: 'User created' } };
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) return { status: 'NOT_FOUND', data: { message: 'User not found' } };
    return { status: 'SUCCESSFUL', data: user };
  }

  async update(id: string, user: IUser) {
    const updatedUser = await this.userModel.update(id, user);
    if (!updatedUser) return { status: 'NOT_FOUND', data: { message: 'User not found' } };
    return { status: 'SUCCESSFUL', data: updatedUser };
  }

  async delete(id: string) {
    return await this.userModel.delete(id);
  }
}