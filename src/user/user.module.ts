import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { User, UserSchema } from "src/user/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [UserService, JwtStrategy],
  controllers: [UserController]
})
export class UserModule { };