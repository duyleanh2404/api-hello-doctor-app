import * as path from "path";

import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

import { AuthController } from "./auth.controller";
import { User, UserSchema } from "src/user/user.schema";

import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET_KEY"),
        signOptions: { expiresIn: "1d" }
      }),
      inject: [ConfigService]
    }),

    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get("MAIL_HOST"),
          port: configService.get("MAIL_PORT"),
          auth: {
            user: configService.get("MAIL_USER"),
            pass: configService.get("MAIL_PASSWORD")
          }
        },
        defaults: {
          from: `"No Reply" <${configService.get("MAIL_FROM")}>`
        },
        template: {
          dir: path.join(process.cwd(), "dist/src/auth/templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            extName: ".hbs",
            layoutsDir: path.join(process.cwd(), "dist/src/auth/templates/layouts")
          }
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService]
})

export class AuthModule { };