import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IUserRepository } from '../domain/user.repository.interface.js';
import { User } from '../domain/user.entity.js';
import { users } from './user.schema.js';
import { DatabaseError } from '../../../shared/infrastructure/http/error-handler.js';

export class UserRepository implements IUserRepository {
  constructor(private db: NodePgDatabase) {}

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const [user] = await this.db
        .insert(users)
        .values({
          name: userData.name,
          email: userData.email,
        })
        .returning();

      return user as User;
    } catch (error: any) {
      if (error.code === '23505') {
        // PostgreSQL unique violation
        throw new Error('Email already exists');
      }
      throw new DatabaseError('Failed to create user');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const result = await this.db.select().from(users);
      return result as User[];
    } catch (error) {
      throw new DatabaseError('Failed to fetch users');
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      const [user] = await this.db
        .select()
        .from(users)
        .where(eq(users.id, id));

      return user ? (user as User) : null;
    } catch (error) {
      throw new DatabaseError('Failed to fetch user');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const [user] = await this.db
        .select()
        .from(users)
        .where(eq(users.email, email));

      return user ? (user as User) : null;
    } catch (error) {
      throw new DatabaseError('Failed to fetch user by email');
    }
  }

  async update(id: number, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | null> {
    try {
      const [updatedUser] = await this.db
        .update(users)
        .set({
          ...userData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();

      return updatedUser ? (updatedUser as User) : null;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new Error('Email already exists');
      }
      throw new DatabaseError('Failed to update user');
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.db
        .delete(users)
        .where(eq(users.id, id))
        .returning();

      return result.length > 0;
    } catch (error) {
      throw new DatabaseError('Failed to delete user');
    }
  }
}
