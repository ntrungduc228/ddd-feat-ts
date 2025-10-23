import { IPostRepository } from '../domain/post.repository.interface.js';
import { Post } from '../domain/post.entity.js';
import { NotFoundError } from '../../../shared/infrastructure/http/error-handler.js';

export class PostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async createPost(data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    const post = await this.postRepository.create(data);
    return post;
  }

  async getAllPosts(): Promise<Post[]> {
    return await this.postRepository.findAll();
  }

  async getPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundError('Post not found');
    }
    return post;
  }

  async updatePost(id: number, data: Partial<Omit<Post, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Post> {
    // Check if post exists
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new NotFoundError('Post not found');
    }

    // Update post
    const updatedPost = await this.postRepository.update(id, data);
    if (!updatedPost) {
      throw new NotFoundError('Post not found');
    }

    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    const result = await this.postRepository.delete(id);
    if (!result) {
      throw new NotFoundError('Post not found');
    }
    return result;
  }
}
