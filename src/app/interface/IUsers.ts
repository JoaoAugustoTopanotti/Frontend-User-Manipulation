export interface IUser  {
  id?: string; // pode ser opcional no cadastro
  name: string;
  email: string;
  birthDate?: string;
  contact?: string;
  nationalId?: string;
  password?: string; // só será usado no cadastro
  token?: string;    // só será usado no cadastro
}
