import { Document, Schema as MongooseSchema } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })

export class Schedule extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Doctor", required: true })
  doctor_id: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  timeSlots: Array<{ timeline: string, isBooked: boolean }>;
};

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);