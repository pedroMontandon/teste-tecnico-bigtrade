import { IUser } from "../../types/IUser";


export const retrievedUser = {
  id: 'valid_id',
  displayName: 'Chapolin Colorado',
  email: 'chapolin@email.com',
}

export const newValidUser: IUser = {
  displayName: 'Chapolin Colorado',
  email: 'chapolin@email.com',
  password: 'sigam-me os bons'
}

export const userWithoutDisplayName: IUser = {
  displayName: '',
  email: 'withoutname@email.com',
  password: 'withoutname'
}

export const userWithoutEmail: IUser = {
  displayName: 'Without Email',
  email: '',
  password: 'withoutemail'
}

export const userWithoutPassword: IUser = {
  displayName: 'Without Password',
  email: 'withoutpassword',
  password: ''
}

export const userWithInvalidEmail: IUser = {
  displayName: 'Invalid Email',
  email: 'invalidemail',
  password: 'invalidemail'
}

export const userWithShortPassword: IUser = {
  displayName: 'Short Password',
  email: 'shortpassword@email.com',
  password: '123'
}
