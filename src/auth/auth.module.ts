import * as path from "path";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "src/user/user.service";
import { User, UserSchema } from "src/user/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: `${process.env.JWT_SECRET_KEY}`,
      signOptions: { expiresIn: "1d" }
    }),
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
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
  providers: [AuthService, UserService],
  controllers: [AuthController]
})
export class AuthModule { };