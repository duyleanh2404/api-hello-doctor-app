import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Appointment extends Document {
  @Prop({ type: Types.ObjectId, ref: "User", required: true, index: true })
  user_id: string;

  @Prop({ type: Types.ObjectId, ref: "Doctor", required: true, index: true })
  doctor_id: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  newPatients: boolean;

  @Prop({ required: true })
  zaloPhone: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  reasons: string;

  @Prop({ required: true })
  payment: string;

  @Prop()
  token: string;

  @Prop({ required: true })
  isVerified: boolean;

  @Prop({ required: true })
  isFinished: boolean;
};

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

AppointmentSchema.index({ user_id: 1, doctor_id: 1 });