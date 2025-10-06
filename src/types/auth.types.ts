// Tipos para autenticación

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  roles: string[];
  accessToken: string;
}
