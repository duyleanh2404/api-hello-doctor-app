import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";

import { RolesGuard } from "./auth/passport/roles.guard";
import { JwtAuthGuard } from "./auth/passport/jwt-auth.guard";

import { UserService } from "./user/user.service";
import { User, UserSchema } from "./user/user.schema";
import { JwtStrategy } from "./auth/passport/jwt.strategy";

import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PostModule } from './post/post.module';
import { ClinicModule } from "./clinic/clinic.module";
import { DoctorModule } from './doctor/doctor.module';
import { ScheduleModule } from './schedule/schedule.module';
import { SpecialtyModule } from "./specialty/specialty.module";
import { AppointmentModule } from './appointment/appointment.module';
import { HistoryController } from './history/history.controller';
import { HistoryService } from './history/history.service';
import { HistoryModule } from './history/history.module';
import { PaymentController } from './payment/payment.controller';
import { PaymentService } from './payment/payment.service';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    PostModule,
    AuthModule,
    UserModule,
    DoctorModule,
    ClinicModule,
    HistoryModule,
    PaymentModule,
    PassportModule,
    ScheduleModule,
    SpecialtyModule,
    AppointmentModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forRoot("mongodb+srv://duyleanh2404:0918496273Duy@cluster0.hvx43.mongodb.net/"),
  ],
  controllers: [],
  providers: [UserService, JwtStrategy, RolesGuard, JwtAuthGuard]
})
export class AppModule { };