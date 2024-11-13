import { Document } from "mongoose";
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Clinic extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, index: true })
  normalizedName: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  province: string;

  @Prop({ required: true })
  desc: string;

  @Prop({ required: true })
  avatarName: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({ required: true })
  bannerName: string;

  @Prop({ required: true })
  banner: string;
};

export const ClinicSchema = SchemaFactory.createForClass(Clinic);

ClinicSchema.index({ normalizedName: 1 });