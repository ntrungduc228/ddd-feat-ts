import { Request, Response, NextFunction } from 'express';
import { PostUseCase } from '../application/post.usecase.js';
import { createPostSchema, updatePostSchema } from './post.dto.js';
import { successResponse } from '../../../shared/infrastructure/http/response.helper.js';

export class PostController {
  constructor(private postUseCase: PostUseCase) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validData = createPostSchema.parse(req.body);
      const post = await this.postUseCase.createPost(validData);
      res.status(201).json(successResponse(post, 'Post created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const posts = await this.postUseCase.getAllPosts();
      res.status(200).json(successResponse(posts));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new Error('Invalid post ID');
      }
      const post = await this.postUseCase.getPostById(id);
      res.status(200).json(successResponse(post));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new Error('Invalid post ID');
      }
      const validData = updatePostSchema.parse(req.body);
      const post = await this.postUseCase.updatePost(id, validData);
      res.status(200).json(successResponse(post, 'Post updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new Error('Invalid post ID');
      }
      await this.postUseCase.deletePost(id);
      res.status(200).json(successResponse(null, 'Post deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}
