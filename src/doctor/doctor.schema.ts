import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Doctor extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: "Specialty",
    required: true,
    index: true
  })
  specialty_id: string;

  @Prop({
    type: Types.ObjectId,
    ref: "Clinic",
    required: true,
    index: true
  })
  clinic_id: string;

  @Prop({ required: true, trim: true })
  fullname: string;

  @Prop({ required: true, trim: true, lowercase: true, index: true })
  normalizedFullname: string;

  @Prop({ required: true, trim: true })
  province?: string;

  @Prop({ required: true, trim: true })
  desc: string;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  medical_fee: number;

  @Prop({ required: true, trim: true })
  imageName: string;

  @Prop({ required: true })
  image: string;
};

export const DoctorSchema = SchemaFactory.createForClass(Doctor);

DoctorSchema.index({ specialty_id: 1, clinic_id: 1 });