export interface JwtPayload {
  id: string;
  email: string;
  active: boolean;
  role: string;
  iat?: string;
  exp?: string;
}

export interface IUseToken {
  role: string;
  id: string;
  isExpired: boolean;
}
