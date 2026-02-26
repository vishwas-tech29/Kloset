import { Address } from './order';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'customer' | 'admin';
  addresses: SavedAddress[];
  createdAt: string;
}

export interface SavedAddress extends Address {
  id: string;
  isDefault: boolean;
}
