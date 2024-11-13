import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class History extends Document {
  @Prop({ type: Types.ObjectId, ref: "Appointment", required: true, index: true })
  appointment_id: string;

  @Prop({ required: true })
  doctorComment: string;

  @Prop({ required: true })
  healthStatus: string;

  @Prop({ required: true })
  prescriptionImage: string;
};

export const HistorySchema = SchemaFactory.createForClass(History);