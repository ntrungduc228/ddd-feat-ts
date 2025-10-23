import { IUserRepository } from '../domain/user.repository.interface.js';
import { User } from '../domain/user.entity.js';
import { NotFoundError, ValidationError } from '../../../shared/infrastructure/http/error-handler.js';

export class UserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationError('Email already exists');
    }

    // Create user
    const user = await this.userRepository.create(data);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async updateUser(id: number, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User> {
    // Check if user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // If updating email, check if new email already exists
    if (data.email && data.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(data.email);
      if (userWithEmail) {
        throw new ValidationError('Email already exists');
      }
    }

    // Update user
    const updatedUser = await this.userRepository.update(id, data);
    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    if (!result) {
      throw new NotFoundError('User not found');
    }
    return result;
  }
}
