import {
  Get, Put, Post, Body, Param, Query, Delete, UseGuards,
  Controller, UploadedFile, UseInterceptors, NotFoundException
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { PostService } from "./post.service";
import { Post as _Post } from "./post.schema";
import { Roles } from "src/auth/passport/roles.decorator";

import { RolesGuard } from "src/auth/passport/roles.guard";
import { JwtAuthGuard } from "src/auth/passport/jwt-auth.guard";

import { EditPostDto } from "./dto/edit-post.dto";
import { GetAllPostsDto } from "./dto/get-all-posts.dto";
import { CreatePostDto } from "./dto/create-new-post.dto";

@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor")
  @UseInterceptors(FileInterceptor("image"))
  async createPost(
    @Body() dto: CreatePostDto, @UploadedFile() image: Express.Multer.File
  ): Promise<{ message: string }> {
    await this.postService.createPost(dto, image);
    return { message: "Post created successfully!" }
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor")
  @UseInterceptors(FileInterceptor("image"))
  async editPost(
    @Param("id") id: string, @Body() dto: EditPostDto, @UploadedFile() image: Express.Multer.File
  ): Promise<{ message: string; post: _Post }> {
    const post = await this.postService.editPost(id, dto, image);
    return { message: "Post updated successfully!", post };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor")
  async deletePost(@Param("id") id: string): Promise<{ message: string }> {
    await this.postService.deletePost(id);
    return { message: "Post deleted successfully!" };
  }

  @Get()
  async getAllPosts(@Query() dto: GetAllPostsDto): Promise<{
    message: string; total: number; posts: _Post[]
  }> {
    const { posts, total } = await this.postService.getAllPosts(dto);
    return { message: "Posts retrieved successfully!", total, posts };
  }

  @Get(":id")
  async getPostById(@Param("id") id: string): Promise<{ message: string; post: _Post }> {
    const post = await this.postService.getPostById(id);
    if (!post) {
      throw new NotFoundException("Post not found");
    }
    return { message: "Post retrieved successfully!", post };
  }
};