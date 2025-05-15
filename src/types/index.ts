export interface User {
  id: number;
  email: string;
  role: 'admin' | 'company';
}

export interface Company {
  id: number;
  name: string;
  user_id?: number;
  phone: string;
  email: string;
  description: string;
  regions: Region[];
}

export interface Region {
  id: number;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  company_name: string;
  phone: string;
  regions: number[];
  description: string;
}