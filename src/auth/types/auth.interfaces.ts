export interface User {
    id: number;
    username: string;
    password: string;
    type: 'normal' | 'admin';
    email: string;
  }