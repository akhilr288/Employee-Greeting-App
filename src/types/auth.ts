export type UserRole = 'ADMIN' | 'HR' | 'EMPLOYEE'

export interface AuthUser {
  id: number | string
  name: string
  email: string
  role: UserRole
}

export interface LoginApiUser {
  id?: number | string
  user_id?: string
  name: string
  email: string
  role?: string
  user_role?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  access_token?: string
  token_type?: string
  user?: AuthUser | LoginApiUser
  role?: string
  data?: {
    access_token?: string
    token_type?: string
    user?: AuthUser | LoginApiUser
    role?: string
  }
}
