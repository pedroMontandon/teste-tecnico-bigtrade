import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  displayName: string;
  email: string;
  password: string;
}