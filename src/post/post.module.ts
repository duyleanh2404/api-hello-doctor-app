import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { PostService } from "./post.service";
import { PostController } from "./post.controller";

import { PostSchema } from "./post.schema";
import { Post as _Post } from "./post.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: _Post.name, schema: PostSchema }])
  ],
  controllers: [PostController],
  providers: [PostService]
})

export class PostModule { };