import { User } from './user.interface';

export type AuthErrorType =
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'TOKEN_EXPIRED';

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserSession {
  user: User;
  token: string;
  expiresAt: Date;
}

export type AuthResult =
  | { success: true; session: UserSession }
  | { success: false; error: string; type: AuthErrorType };
