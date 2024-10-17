import { Controller, Post, Body, UseInterceptors, UploadedFile, Query, Get, Delete, Param, NotFoundException, Put } from "@nestjs/common";

import { Posts } from "./post.schema";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/create-new-post.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { GetAllPostsDto } from "./dto/get-all-posts";
import { UpdatePostDto } from "./dto/update-post.dto";

@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() image: Express.Multer.File
  ): Promise<Posts> {
    return this.postService.createPost(createPostDto, image);
  }

  @Put(":id")
  @UseInterceptors(FileInterceptor("image"))
  async updatePost(
    @Param("id") id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() updatePostDto: UpdatePostDto
  ): Promise<{ message: string; post: Posts }> {
    const updatedPost = await this.postService.updatePost(id, updatePostDto, image);
    return {
      message: "Post updated successfully!",
      post: updatedPost
    };
  }

  @Delete(":id")
  async deletePost(@Param("id") id: string): Promise<{ message: string }> {
    await this.postService.deletePost(id);
    return { message: "Post deleted successfully!" };
  }

  @Get()
  async getAllPosts(@Query() getAllPostsDto: GetAllPostsDto): Promise<{
    message: string; total: number; posts: Posts[]
  }> {
    const { posts, total } = await this.postService.getAllPosts(getAllPostsDto);
    return {
      message: "Posts retrieved successfully!",
      total,
      posts
    };
  }

  @Get(":id")
  async getPostById(@Param("id") id: string): Promise<{ message: string; post: Posts }> {
    const post = await this.postService.getPostById(id);
    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return {
      message: "Post retrieved successfully!",
      post
    };
  }
};