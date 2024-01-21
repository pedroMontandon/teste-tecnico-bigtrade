import UserModel from '../models/UserModel';
import UserService from '../services/UserService';
import { IUser } from '../types/IUser';

export default async function initializeDatabase(): Promise<void> {
  const admin = { displayName: 'admin', email: 'admin@example.com', password: 'adminPassword' };
  const user: IUser = { displayName: 'user', email: 'user@example.com', password: 'userPassword' };


  const userService = new UserService();
  await userService.create(admin);
  await userService.create(user);
  
  console.log('Dados iniciais adicionados ao banco de dados.');
}
