import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";

import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { UserService } from "./user/user.service";
import { ClinicModule } from "./clinic/clinic.module";
import { User, UserSchema } from "./user/user.schema";
import { JwtStrategy } from "./auth/passport/jwt.strategy";
import { RolesGuard } from "./auth/passport/roles.guard";
import { JwtAuthGuard } from "./auth/passport/jwt-auth.guard";
import { SpecialtyModule } from "./specialty/specialty.module";
import { DoctorModule } from './doctor/doctor.module';
import { PostModule } from './post/post.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    PostModule,
    AuthModule,
    UserModule,
    DoctorModule,
    ClinicModule,
    PassportModule,
    SpecialtyModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forRoot("mongodb+srv://duyleanh2404:0918496273Duy@cluster0.hvx43.mongodb.net/"),
    ScheduleModule,
  ],
  controllers: [],
  providers: [UserService, JwtStrategy, RolesGuard, JwtAuthGuard]
})
export class AppModule { };