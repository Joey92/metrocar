declare namespace Express {
  export interface User {
    id: string;
    name: string;
    email: string;
    roles: string[];
  }
}