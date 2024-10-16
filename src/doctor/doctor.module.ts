import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { DoctorService } from "./doctor.service";
import { DoctorController } from "./doctor.controller";
import { Doctor, DoctorSchema } from "./doctor.schema";
import { User, UserSchema } from "src/user/user.schema";
import { Clinic, ClinicSchema } from "src/clinic/clinic.schema";
import { Specialty, SpecialtySchema } from "src/specialty/specialty.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
    MongooseModule.forFeature([{ name: Clinic.name, schema: ClinicSchema }]),
    MongooseModule.forFeature([{ name: Specialty.name, schema: SpecialtySchema }])
  ],
  controllers: [DoctorController],
  providers: [DoctorService]
})
export class DoctorModule { };