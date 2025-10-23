import { Post } from './post.entity.js';

export interface IPostRepository {
  create(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post>;
  findAll(): Promise<Post[]>;
  findById(id: number): Promise<Post | null>;
  update(id: number, post: Partial<Omit<Post, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Post | null>;
  delete(id: number): Promise<boolean>;
}
