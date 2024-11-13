import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { SpecialtyService } from "./specialty.service";
import { SpecialtyController } from "./specialty.controller";
import { Specialty, SpecialtySchema } from "./specialty.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Specialty.name, schema: SpecialtySchema }])
  ],
  controllers: [SpecialtyController],
  providers: [SpecialtyService]
})
export class SpecialtyModule { };