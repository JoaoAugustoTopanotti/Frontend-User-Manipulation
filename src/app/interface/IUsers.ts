import { DefaultUser } from 'next-auth'


export interface IUser extends DefaultUser {
  id: string;
  name: string;
  email: string;
  birthDate?: string;
  contact?: string;
  nationalId?: string;
}