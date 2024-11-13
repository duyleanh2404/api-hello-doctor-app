import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";

import { Post } from "./post.schema";

import { normalizeString } from "utils/normalize-string";
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

  async editPost(
    id: string, dto: EditPostDto, image?: Express.Multer.File
  ): Promise<Post> {
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
      if (value !== undefined && key != "image") {
        post[key] = value;
      }
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
    const filter: Record<string, any> = {};

    const conditions: Record<string, any> = {
      specialty_id: specialty_id && specialty_id !== "all" ? specialty_id : undefined,
      doctor_id: doctor_id && doctor_id !== "all" ? doctor_id : undefined,
      normalizedTitle: query ? { $regex: new RegExp(normalizeString(query), "i") } : undefined,
      releaseDate: releaseDate || undefined
    };

    Object.entries(conditions).forEach(([key, value]) => {
      if (value !== undefined) {
        filter[key] = value;
      }
    });

    let projection: Record<string, number> = {};
    if (exclude) {
      const excludeFields = exclude.split(",").map(field => field.trim());
      const defaultFields = ["title", "desc", "releaseDate", "image"];

      defaultFields.forEach(field => {
        if (!excludeFields.includes(field)) {
          projection[field] = 1;
        }
      });
    }

    const [posts, total] = await Promise.all([
      this.postModel
        .find(filter)
        .populate("doctor_id", "fullname image")
        .populate("specialty_id", "name")
        .select(projection)
        .sort({ releaseDate: -1 })
        .skip(skip)
        .limit(limit)
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