import { Schema, Model, model } from 'mongoose';
import { IUser } from '../types/IUser';

const UserSchema = new Schema({
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
});

export default class UserModel {
  private _model: Model<IUser>;

  constructor() {
    this._model = model<IUser>('User', UserSchema);
  }

  async create(user: IUser): Promise<Partial<IUser> | null> {
    const createdUser = await this._model.create(user);
    const safeUser: Partial<IUser> = createdUser.toObject();
    delete safeUser.password;
    return safeUser;
  }

  async findById(id: string) {
    try {
      return await this._model.findById(id);
    } catch (err: any) { 
      return err.message;
    }
  }

  async update(id: string, user: IUser) {
    return await this._model.findByIdAndUpdate(id, user);
  }

  async delete(id: string) {
    try {
      return await this._model.findByIdAndDelete(id);
    } catch (err: any) {
      return err.message;
    }
  }
}