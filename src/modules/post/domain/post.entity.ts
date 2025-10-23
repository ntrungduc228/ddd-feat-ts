import { BaseEntity } from '../../../shared/domain/base-entity.js';

export interface Post extends BaseEntity {
  title: string;
  content: string;
}

export class PostEntity implements Post {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Post) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static create(data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Omit<Post, 'id' | 'createdAt' | 'updatedAt'> {
    // Business validation can be added here
    return {
      title: data.title.trim(),
      content: data.content.trim(),
    };
  }
}
