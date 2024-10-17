import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

@Schema({ timestamps: true })

export class Schedules extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Doctor", required: true })
  doctor_id: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  timeSlots: Array<{ type: string; timeline: string, isBooked: boolean }>;
};

export const SchedulesSchema = SchemaFactory.createForClass(Schedules);