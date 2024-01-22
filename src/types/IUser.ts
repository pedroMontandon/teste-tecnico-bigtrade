export interface INewUser {
  displayName: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export interface IUser extends INewUser {
  id: string;
}