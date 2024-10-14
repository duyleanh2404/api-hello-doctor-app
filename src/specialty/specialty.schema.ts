import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type SpecialtyDocument = Specialty & Document;

@Schema({ timestamps: true })
export class Specialty {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  normalizedName: string;

  @Prop({ required: true })
  desc: string;

  @Prop({ required: true })
  imageName: string;

  @Prop({ required: true })
  image: string;
};

export const SpecialtySchema = SchemaFactory.createForClass(Specialty);