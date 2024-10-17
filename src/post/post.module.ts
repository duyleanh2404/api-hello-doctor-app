import { Module, Post } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Posts } from "./post.schema";
import { PostsSchema } from "./post.schema";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }])
  ],
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule { };