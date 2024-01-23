import UserModel from '../models/UserModel';
import PostModel from '../models/PostModel';
import UserService from '../services/UserService';
import { INewUser } from '../types/IUser';
import { INewPost } from '../types/IPost';

export default async function initializeDatabase(): Promise<void> {
  const admin: INewUser = { displayName: 'admin', email: 'admin@example.com', password: 'adminPassword', role: 'admin' };
  const user: INewUser = { displayName: 'user', email: 'user@example.com', password: 'userPassword', role: 'user' };

  const userService = new UserService();
  const userModel = new UserModel();
  const postModel = new PostModel();

  await userService.create(admin);
  await userService.create(user);

  const createdAdmin = await userModel.findByEmail(admin.email);
  const createdUser = await userModel.findByEmail(user.email);

  const adminPost: INewPost = { title: 'Admin post', content: 'One admin to impose, one post to rule them all', userId: createdAdmin!.id! };
  const userPost: INewPost = { title: 'User post', content: 'One user to find them, one post to bring them all', userId: createdUser!.id! };

  await postModel.create(adminPost);
  await postModel.create(userPost);

  console.log('Dados iniciais adicionados ao banco de dados.');
}
