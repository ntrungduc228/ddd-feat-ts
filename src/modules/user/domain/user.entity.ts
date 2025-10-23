import { BaseEntity } from '../../../shared/domain/base-entity.js';

export interface User extends BaseEntity {
  name: string;
  email: string;
}

export class UserEntity implements User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: User) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
    // Business validation can be added here
    return {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
    };
  }
}
