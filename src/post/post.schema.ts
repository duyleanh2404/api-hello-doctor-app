import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ type: Types.ObjectId, ref: "Specialty", required: true, index: true })
  specialty_id: string;

  @Prop({ type: Types.ObjectId, ref: "Doctor", required: true, index: true })
  doctor_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, index: true })
  normalizedTitle: string;

  @Prop({ required: true })
  desc: string;

  @Prop({ required: true })
  releaseDate: string;

  @Prop({ required: true })
  imageName: string;

  @Prop({ required: true })
  image: string;
};

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ specialty_id: 1, doctor_id: 1, normalizedTitle: 1 });