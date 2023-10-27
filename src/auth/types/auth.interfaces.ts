export interface User {
    id: number;
    name: string;
    password: string;
    type: 'user' | 'admin';
    email: string;
    created_at: Date;
    updated_at: Date;
  }

  export interface PartialUserUpdateSchema {
    name?: string;
    password?: string;
    email?: string;
  }