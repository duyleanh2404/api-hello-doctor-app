import { Model } from "mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Posts } from "./post.schema";
import { normalizeString } from "utils/normalize-string";
import { CreatePostDto } from "./dto/create-new-post.dto";
import { convertImageToBase64 } from "utils/convert-to-base64";
import { GetAllPostsDto } from "./dto/get-all-posts";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostService {
  constructor(@InjectModel(Posts.name) private postModel: Model<Posts>) { }

  async createPost(
    createPostDto: CreatePostDto,
    image: Express.Multer.File
  ): Promise<Posts> {
    const createdPost = new this.postModel({
      ...createPostDto,
      image: convertImageToBase64(image),
      normalizedTitle: normalizeString(createPostDto.title)
    });

    return createdPost.save();
  }

  async updatePost(
    id: string,
    updatePostDto: UpdatePostDto,
    image?: Express.Multer.File
  ): Promise<Posts> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException({
        errorCode: "POST_NOT_FOUND",
        message: "Post not found!"
      });
    }

    if (updatePostDto.title) {
      post.title = updatePostDto.title;
      post.normalizedTitle = normalizeString(updatePostDto.title);
    }

    if (updatePostDto.desc) {
      post.desc = updatePostDto.desc;
    }

    if (updatePostDto.release_date) {
      post.release_date = updatePostDto.release_date;
    }

    if (updatePostDto.doctor_id) {
      post.doctor_id = updatePostDto.doctor_id;
    }

    if (updatePostDto.specialty_id) {
      post.specialty_id = updatePostDto.specialty_id;
    }

    if (updatePostDto.imageName) {
      post.imageName = updatePostDto.imageName;
    }

    if (image) {
      post.image = convertImageToBase64(image);
    }

    return post.save();
  }

  async deletePost(id: string): Promise<{ message: string }> {
    const post = await this.postModel.findByIdAndDelete(id).exec();
    if (!post) {
      throw new NotFoundException("Post not found!");
    }

    return { message: "Post deleted successfully!" };
  }

  async getAllPosts({ page, limit, query, specialty, doctor, release_date }: GetAllPostsDto): Promise<{
    posts: Posts[];
    total: number;
  }> {
    const skip = (page - 1) * limit;
    const normalizedSearchTerm = normalizeString(query || "");

    const filter: any = {};

    if (normalizedSearchTerm) {
      filter.title = { $regex: new RegExp(normalizedSearchTerm, "i") };
    }

    if (specialty && specialty !== "all") {
      filter.specialty_id = specialty;
    }

    if (doctor && doctor !== "all") {
      filter.doctor_id = doctor;
    }

    if (release_date) {
      filter.release_date = release_date;
    }

    const [posts, total] = await Promise.all([
      this.postModel
        .find(filter)
        .populate("doctor_id", "fullname")
        .populate("specialty_id", "name")
        .skip(skip)
        .limit(limit)
        .exec(),
      this.postModel.countDocuments(filter).exec(),
    ]);

    return { posts, total };
  }

  async getPostById(id: string): Promise<Posts> {
    const post = await this.postModel
      .findById(id)
      .populate("specialty_id", "name")
      .populate("doctor_id", "fullname")
      .exec();

    if (!post) {
      throw new NotFoundException("Post not found!");
    }

    return post;
  }
};