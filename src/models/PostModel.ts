import { Schema, Model, model } from 'mongoose';
import { INewPost, IPost } from '../types/IPost';

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: String, required: true },
}, {
  timestamps: { createdAt: 'published', updatedAt: 'updated' },
});

export default class PostModel {
  private _model: Model<IPost>;

  constructor() {
    this._model = model<IPost>('Post', PostSchema);
  }

  async create(post: INewPost): Promise<IPost | null> {
    const createdPost = await this._model.create(post);
    return createdPost.toObject();
  }

  async findAll(): Promise<Partial<IPost>[]> {
    try {
      return await this._model.find();
    } catch (err: any) {
      return err.message;
    }
  }

  async findById(id: string): Promise<IPost | null> {
    try {
      return await this._model.findById(id);
    } catch (err: any) { 
      return err.message;
    }
  }

  async update(id: string, post: INewPost): Promise<IPost | null> {
    return await this._model.findByIdAndUpdate(id, post);
  }

  async delete(id: string) {
    try {
      return await this._model.findByIdAndDelete(id);
    } catch (err: any) {
      return err.message;
    }
  }
}