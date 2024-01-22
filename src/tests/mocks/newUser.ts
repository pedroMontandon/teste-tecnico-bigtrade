import { INewUser, IUser } from "../../types/IUser";


export const retrievedUser: Partial<IUser> = {
  id: '65ad8856fd2988054efc6577',
  displayName: 'Chapolin Colorado',
  email: 'chapolin@email.com',
}

export const newValidUser: INewUser = {
  displayName: 'Chapolin Colorado',
  email: 'chapolin@email.com',
  password: 'sigam-me os bons',
  role: 'admin'
}

export const userWithoutDisplayName: INewUser = {
  displayName: '',
  email: 'withoutname@email.com',
  password: 'withoutname',
  role: 'user'
}

export const userWithoutEmail: INewUser = {
  displayName: 'Without Email',
  email: '',
  password: 'withoutemail',
  role: 'user'
}

export const userWithoutPassword: INewUser = {
  displayName: 'Without Password',
  email: 'withoutpassword',
  password: '',
  role: 'user'
}

export const userWithInvalidEmail: INewUser = {
  displayName: 'Invalid Email',
  email: 'invalidemail',
  password: 'invalidemail',
  role: 'user'
}

export const userWithShortPassword: INewUser = {
  displayName: 'Short Password',
  email: 'shortpassword@email.com',
  password: '123',
  role: 'user'
}
