import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Specialty extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, index: true })
  normalizedName: string;

  @Prop({ required: true })
  desc: string;

  @Prop({ required: true })
  imageName: string;

  @Prop({ required: true })
  image: string;
};

export const SpecialtySchema = SchemaFactory.createForClass(Specialty);

SpecialtySchema.index({ normalizedName: 1 });