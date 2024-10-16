import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type SpecialtyDocument = Specialty & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Specialty {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true, index: true })
  normalizedName: string;

  @Prop({ required: true, trim: true })
  desc: string;

  @Prop({ required: true, trim: true })
  imageName: string;

  @Prop({ required: true })
  image: string;
};

export const SpecialtySchema = SchemaFactory.createForClass(Specialty);

SpecialtySchema.index({ normalizedName: 1 });