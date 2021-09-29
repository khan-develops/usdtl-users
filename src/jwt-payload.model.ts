export interface JwtPayload {
  isAuthenticated: boolean;
  group: string;
  userPrincipalName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  description: string; 
}