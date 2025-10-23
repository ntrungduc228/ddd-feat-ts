import { Router } from 'express';
import { db } from '../../../shared/infrastructure/database/db.client.js';
import { PostRepository } from '../infrastructure/post.repository.js';
import { PostUseCase } from '../application/post.usecase.js';
import { PostController } from './post.controller.js';

const router = Router();

// Dependency injection
const postRepository = new PostRepository(db);
const postUseCase = new PostUseCase(postRepository);
const postController = new PostController(postUseCase);

// Routes
router.post('/posts', postController.create);
router.get('/posts', postController.getAll);
router.get('/posts/:id', postController.getById);
router.patch('/posts/:id', postController.update);
router.delete('/posts/:id', postController.delete);

export default router;
