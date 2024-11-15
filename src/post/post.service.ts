import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";

import { Post } from "./post.schema";

import { normalizeString } from "utils/normalize-string";
import { createProjection } from "utils/create-projection";
import { convertImageToBase64 } from "utils/convert-to-base64";

import { EditPostDto } from "./dto/edit-post.dto";
import { GetAllPostsDto } from "./dto/get-all-posts.dto";
import { CreatePostDto } from "./dto/create-new-post.dto";

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) { }

  async createPost(dto: CreatePostDto, image: Express.Multer.File): Promise<Post> {
    const createdPost = new this.postModel({
      ...dto,
      image: convertImageToBase64(image),
      normalizedTitle: normalizeString(dto.title)
    });

    return createdPost.save();
  }

  async editPost(id: string, dto: EditPostDto, image?: Express.Multer.File): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException("Post not found!");
    }

    if (dto.title) {
      post.normalizedTitle = normalizeString(dto.title);
    }
    if (image) {
      post.image = convertImageToBase64(image);
    }

    Object.entries(dto).forEach(([key, value]) => {
      if (key !== "normalizedTitle" && key != "image") post[key] = value;
    });

    return await post.save();
  }

  async deletePost(id: string) {
    const post = await this.postModel.findByIdAndDelete(id).exec();
    if (!post) {
      throw new NotFoundException("Post not found!");
    }
  }

  async getAllPosts({
    page = 1, limit = 10, doctor_id, specialty_id, query, exclude, releaseDate
  }: GetAllPostsDto): Promise<{ posts: Post[]; total: number }> {
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {
      ...(query && { normalizedTitle: { $regex: new RegExp(normalizeString(query), "i") } }),
      ...(doctor_id && doctor_id !== "all" && { doctor_id }),
      ...(specialty_id && specialty_id !== "all" && { specialty_id }),
      ...(releaseDate && { releaseDate })
    };

    const defaultFields = ["title", "desc", "releaseDate", "image"];
    const projection = createProjection(defaultFields, exclude);

    const [posts, total] = await Promise.all([
      this.postModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .populate("doctor_id", "fullname image")
        .populate("specialty_id", "name")
        .select(projection)
        .sort({ releaseDate: -1 })
        .exec(),
      this.postModel.countDocuments(filter).exec(),
    ]);

    return { posts, total };
  }

  async getPostById(id: string): Promise<Post> {
    const post = await this.postModel
      .findById(id)
      .populate("specialty_id", "name")
      .populate("doctor_id", "fullname image")
      .exec();

    if (!post) {
      throw new NotFoundException("Post not found!");
    }

    return post;
  }
};