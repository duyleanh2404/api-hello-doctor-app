import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AppointmentService } from "./appointment.service";
import { AppointmentController } from "./appointment.controller";

import { User, UserSchema } from "src/user/user.schema";
import { Doctor, DoctorSchema } from "src/doctor/doctor.schema";
import { Clinic, ClinicSchema } from "src/clinic/clinic.schema";
import { Appointment, AppointmentSchema } from "./appointment.schema";
import { Schedule, ScheduleSchema } from "src/schedule/schedule.schema";
import { Specialty, SpecialtySchema } from "src/specialty/specialty.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
    MongooseModule.forFeature([{ name: Clinic.name, schema: ClinicSchema }]),
    MongooseModule.forFeature([{ name: Schedule.name, schema: ScheduleSchema }]),
    MongooseModule.forFeature([{ name: Specialty.name, schema: SpecialtySchema }]),
    MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }])
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService]
})

export class AppointmentModule { };