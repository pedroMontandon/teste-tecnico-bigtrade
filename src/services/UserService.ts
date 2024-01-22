import UserModel from '../models/UserModel';
import { IUser } from '../types/IUser';
import { ServiceResponse } from '../types/ServiceResponseTypes';
import * as bcrypt from 'bcryptjs';

export default class UserService {
  private userModel: UserModel;
  private emailInUse = "Email address is already in use by another user."
  private userNotFound = "User not found"

  constructor() {
    this.userModel = new UserModel();
  }

  async create(user: IUser): Promise<ServiceResponse< Partial<IUser> | null>> {
    try {
      const encryptedPassword = await bcrypt.hash(user.password, 10);
      const newUser = { ...user, password: encryptedPassword }
      const createdUser =  await this.userModel.create(newUser);
      return { status: 'CREATED', data: createdUser };
    } catch (err: any) {
      if (err.code === 11000) return { status: 'CONFLICT', data: { message: this.emailInUse } };
      return { status: 'INTERNAL_SERVER_ERROR', data: { message: err.message } };
    }
  }

  async findById(id: string): Promise<ServiceResponse<Partial<IUser>>> {
    const user = await this.userModel.findById(id);
    if (!user) return { status: 'NOT_FOUND', data: { message: this.userNotFound } };
    return { status: 'SUCCESSFUL', data: user };
  }

  async update(id: string, user: IUser): Promise<ServiceResponse<Partial<IUser> | null>> {
    try {
      const encryptedPassword = await bcrypt.hash(user.password, 10);
      const newUser = { ...user, password: encryptedPassword }
      const updatedUser = await this.userModel.update(id, newUser);
      if (!updatedUser) return { status: 'NOT_FOUND', data: { message: this.userNotFound } };
      const retrievedUser = (await this.findById(id)).data as Partial<IUser>;
      return { status: 'SUCCESSFUL', data: retrievedUser as Partial<IUser> };
    } catch (err: any) {
      if (err.code === 11000) return { status: 'CONFLICT', data: { message: this.emailInUse } };
      return { status: 'INTERNAL_SERVER_ERROR', data: { message: err.message } };
    }
  }

  async delete(id: string): Promise<ServiceResponse<IUser>> {
    const deletedUser = await this.userModel.delete(id);
    if (!deletedUser) return { status: 'NOT_FOUND', data: { message: this.userNotFound } };
    return { status: 'SUCCESSFUL', data: deletedUser };
  }
}