import UserModel from '../models/UserModel';
import { IUser } from '../types/IUser';
import { ServiceResponse } from '../types/ServiceResponseTypes';
import bcrypt from 'bcrypt';

export default class UserService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  async create(user: IUser): Promise<ServiceResponse< { message: string}>> {
    const existingUser = await this.userModel.findByEmail(user.email);
    if (existingUser) return { status: 'CONFLICT', data: { message: 'User already exists' } };
    const encryptedPassword = bcrypt.hashSync(user.password, 10);
    const newUser = { ...user, password: encryptedPassword }
    await this.userModel.create(newUser);
    return { status: 'CREATED', data: { message: 'User created' } };
  }

  async findById(id: string): Promise<ServiceResponse<Partial<IUser>>> {
    const user = await this.userModel.findById(id);
    if (!user) return { status: 'NOT_FOUND', data: { message: 'User not found' } };
    return { status: 'SUCCESSFUL', data: user };
  }

  async update(id: string, user: IUser): Promise<ServiceResponse<Partial<IUser> | null>> {
    const encryptedPassword = bcrypt.hashSync(user.password, 10);
    const newUser = { ...user, password: encryptedPassword}
    const updatedUser = await this.userModel.update(id, newUser);
    if (!updatedUser) return { status: 'NOT_FOUND', data: { message: 'User not found' } };
    return { status: 'SUCCESSFUL', data: updatedUser };
  }

  async delete(id: string): Promise<ServiceResponse<{ message: string }>> {
    const deletedUser = await this.userModel.delete(id);
    if (!deletedUser) return { status: 'NOT_FOUND', data: { message: 'User not found' } };
    return { status: 'SUCCESSFUL', data: { message: `User ${id} has been deleted` } };
  }
}