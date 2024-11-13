import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ScheduleService } from "./schedule.service";
import { ScheduleController } from "./schedule.controller";

import { Schedule, ScheduleSchema } from "./schedule.schema";
import { Doctor, DoctorSchema } from "src/doctor/doctor.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Schedule.name, schema: ScheduleSchema }]),
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }])
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService]
})
export class ScheduleModule { };