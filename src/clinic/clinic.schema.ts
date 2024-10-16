import { Document } from "mongoose";
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";

export type ClinicDocument = Clinic & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Clinic {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true, index: true })
  normalizedName: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ required: true, trim: true })
  province: string;

  @Prop({ required: true, trim: true })
  desc: string;

  @Prop({ required: true, trim: true })
  avatarName: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({ required: true, trim: true })
  bannerName: string;

  @Prop({ required: true })
  banner: string;
};

export const ClinicSchema = SchemaFactory.createForClass(Clinic);

ClinicSchema.index({ normalizedName: 1 });