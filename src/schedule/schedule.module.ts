import { Module } from "@nestjs/common";

import { ScheduleService } from "./schedule.service";
import { ScheduleController } from "./schedule.controller";
import { Schedules, SchedulesSchema } from "./schedule.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { Doctor, DoctorSchema } from "src/doctor/doctor.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Schedules.name, schema: SchedulesSchema }]),
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService]
})
export class ScheduleModule { };