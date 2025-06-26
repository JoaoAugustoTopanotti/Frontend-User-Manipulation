export interface IUser  {
  id?: string; // pode ser opcional no cadastro
  name: string;
  email: string;
  birthDate: string;
  contact?: string;
  nationalId?: string;
  password?: string; // só será usado no cadastro
  token?: string;    // só será usado no cadastro
  isDeleted?: boolean;
}

export interface GetUsersParams {
  page: number;
  take: number;
  search?: string;
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}
