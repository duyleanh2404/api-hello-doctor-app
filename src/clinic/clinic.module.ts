import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ClinicService } from "./clinic.service";
import { ClinicController } from "./clinic.controller";
import { Clinic, ClinicSchema } from "./clinic.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Clinic.name, schema: ClinicSchema }])
  ],
  controllers: [ClinicController],
  providers: [ClinicService]
})
export class ClinicModule { };