import { Router } from 'express';
import { db } from '../../../shared/infrastructure/database/db.client.js';
import { UserRepository } from '../infrastructure/user.repository.js';
import { UserUseCase } from '../application/user.usecase.js';
import { UserController } from './user.controller.js';

const router = Router();

// Dependency injection
const userRepository = new UserRepository(db);
const userUseCase = new UserUseCase(userRepository);
const userController = new UserController(userUseCase);

// Routes
router.post('/users', userController.create);
router.get('/users', userController.getAll);
router.get('/users/:id', userController.getById);
router.patch('/users/:id', userController.update);
router.delete('/users/:id', userController.delete);

export default router;
