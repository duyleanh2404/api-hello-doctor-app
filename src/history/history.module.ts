import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { HistoryService } from "./history.service";
import { HistoryController } from "./history.controller";

import { User, UserSchema } from "src/user/user.schema";
import { History, HistorySchema } from "./history.schema";
import { Appointment, AppointmentSchema } from "src/appointment/appointment.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }]),
    MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }])
  ],
  controllers: [HistoryController],
  providers: [HistoryService]
})
export class HistoryModule { };