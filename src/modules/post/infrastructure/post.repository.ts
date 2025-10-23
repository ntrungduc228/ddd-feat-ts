import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IPostRepository } from '../domain/post.repository.interface.js';
import { Post } from '../domain/post.entity.js';
import { posts } from './post.schema.js';
import { DatabaseError } from '../../../shared/infrastructure/http/error-handler.js';

export class PostRepository implements IPostRepository {
  constructor(private db: NodePgDatabase) {}

  async create(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    try {
      const [post] = await this.db
        .insert(posts)
        .values({
          title: postData.title,
          content: postData.content,
        })
        .returning();

      return post as Post;
    } catch (error) {
      throw new DatabaseError('Failed to create post');
    }
  }

  async findAll(): Promise<Post[]> {
    try {
      const result = await this.db.select().from(posts);
      return result as Post[];
    } catch (error) {
      throw new DatabaseError('Failed to fetch posts');
    }
  }

  async findById(id: number): Promise<Post | null> {
    try {
      const [post] = await this.db
        .select()
        .from(posts)
        .where(eq(posts.id, id));

      return post ? (post as Post) : null;
    } catch (error) {
      throw new DatabaseError('Failed to fetch post');
    }
  }

  async update(id: number, postData: Partial<Omit<Post, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Post | null> {
    try {
      const [updatedPost] = await this.db
        .update(posts)
        .set({
          ...postData,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, id))
        .returning();

      return updatedPost ? (updatedPost as Post) : null;
    } catch (error) {
      throw new DatabaseError('Failed to update post');
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.db
        .delete(posts)
        .where(eq(posts.id, id))
        .returning();

      return result.length > 0;
    } catch (error) {
      throw new DatabaseError('Failed to delete post');
    }
  }
}
