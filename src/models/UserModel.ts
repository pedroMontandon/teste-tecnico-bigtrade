import mongoose from 'mongoose';
import { IUser } from '../types/IUser';

const UserSchema = new mongoose.Schema({
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default class UserModel {
  private static _model: mongoose.Model<IUser>;

  public static get model(): mongoose.Model<IUser> {
    if (!this._model) {
      this._model = mongoose.model<IUser>('User', UserSchema);
    }
    return this._model;
  }

  async create(user: IUser) {
    await UserModel.model.create(user);
  }

  async findById(id: string) {
    return await UserModel.model.findById(id);
  }

  async findByEmail(email: string) {
    return await UserModel.model.findOne({ email });
  }

  async update(id: string, user: IUser) {
    return await UserModel.model.findByIdAndUpdate(id, user);
  }

  async delete(id: string) {
    return await UserModel.model.findByIdAndDelete(id);
  }
}