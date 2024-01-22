import PostModel from "../models/PostModel";
import { IPost } from "../types/IPost";
import { ServiceResponse } from "../types/ServiceResponseTypes";

export default class PostService {
  private postModel: PostModel;
  private postNotFound = "Post not found";

  constructor() {
    this.postModel = new PostModel();
  }

  async create(post: IPost): Promise<ServiceResponse<IPost | null>> {
    try {
      const createdPost = await this.postModel.create(post);
      return { status: "CREATED", data: createdPost };
    } catch (err: any) {
      return {
        status: "INTERNAL_SERVER_ERROR",
        data: { message: err.message },
      };
    }
  }

  async findAll(): Promise<ServiceResponse<Partial<IPost>[]>> {
    const posts = await this.postModel.findAll();
    return { status: "SUCCESSFUL", data: posts };
  }

  async findById(id: string): Promise<ServiceResponse<IPost>> {
    const post = await this.postModel.findById(id);
    if (!post)
      return { status: "NOT_FOUND", data: { message: this.postNotFound } };
    return { status: "SUCCESSFUL", data: post };
  }

  async update(id: string, post: IPost): Promise<ServiceResponse<IPost | null>> {
    try {
      const updatedPost = await this.postModel.update(id, post);
      if (!updatedPost)
        return { status: "NOT_FOUND", data: { message: this.postNotFound } };
      const retrievedPost = (await this.findById(id)).data as IPost;
      return { status: "SUCCESSFUL", data: retrievedPost };
    } catch (err: any) {
      return {
        status: "INTERNAL_SERVER_ERROR",
        data: { message: err.message },
      };
    }
  }

  async delete(id: string): Promise<ServiceResponse<IPost>> {
    const deletedPost = await this.postModel.delete(id);
    if (!deletedPost)
      return { status: "NOT_FOUND", data: { message: this.postNotFound } };
    return { status: "SUCCESSFUL", data: deletedPost };
  }
}