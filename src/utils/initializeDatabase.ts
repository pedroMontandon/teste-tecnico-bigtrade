import UserModel from '../models/UserModel';
import UserService from '../services/UserService';
import { INewUser } from '../types/IUser';

export default async function initializeDatabase(): Promise<void> {
  const admin: INewUser = { displayName: 'admin', email: 'admin@example.com', password: 'adminPassword', role: 'admin' };
  const user: INewUser = { displayName: 'user', email: 'user@example.com', password: 'userPassword', role: 'user' };


  const userService = new UserService();
  await userService.create(admin);
  await userService.create(user);
  
  console.log('Dados iniciais adicionados ao banco de dados.');
}
