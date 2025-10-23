import { Request, Response, NextFunction } from 'express';
import { UserUseCase } from '../application/user.usecase.js';
import { createUserSchema, updateUserSchema } from './user.dto.js';
import { successResponse } from '../../../shared/infrastructure/http/response.helper.js';

export class UserController {
  constructor(private userUseCase: UserUseCase) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validData = createUserSchema.parse(req.body);
      const user = await this.userUseCase.createUser(validData);
      res.status(201).json(successResponse(user, 'User created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userUseCase.getAllUsers();
      res.status(200).json(successResponse(users));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new Error('Invalid user ID');
      }
      const user = await this.userUseCase.getUserById(id);
      res.status(200).json(successResponse(user));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new Error('Invalid user ID');
      }
      const validData = updateUserSchema.parse(req.body);
      const user = await this.userUseCase.updateUser(id, validData);
      res.status(200).json(successResponse(user, 'User updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new Error('Invalid user ID');
      }
      await this.userUseCase.deleteUser(id);
      res.status(200).json(successResponse(null, 'User deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}
