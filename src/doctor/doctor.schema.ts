import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Doctor extends Document {
  @Prop({ type: Types.ObjectId, ref: "Specialty", required: true, index: true })
  specialty_id: string;

  @Prop({ type: Types.ObjectId, ref: "Clinic", required: true, index: true })
  clinic_id: string;

  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, index: true })
  normalizedFullname: string;

  @Prop({ required: true })
  province: string;

  @Prop({ required: true })
  desc: string;

  @Prop({ required: true })
  medicalFee: number;

  @Prop()
  imageName: string;

  @Prop()
  image: string;
};

export const DoctorSchema = SchemaFactory.createForClass(Doctor);

DoctorSchema.index({ specialty_id: 1, clinic_id: 1, normalizedFullname: 1 });