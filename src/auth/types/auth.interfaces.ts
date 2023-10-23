export interface User {
    id: number;
    username: string;
    password: string;
    type: 'user' | 'admin';
    email: string;
    created_at: Date;
    updated_at: Date;
  }