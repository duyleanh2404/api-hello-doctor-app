import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Posts extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: "Specialty",
    required: true,
    index: true
  })
  specialty_id: string;

  @Prop({
    type: Types.ObjectId,
    ref: "Doctor",
    required: true,
    index: true
  })
  doctor_id: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true, lowercase: true, index: true })
  normalizedTitle: string;

  @Prop({ required: true, trim: true })
  desc: string;

  @Prop()
  release_date?: string;

  @Prop({ trim: true })
  imageName?: string;

  @Prop({ trim: true })
  image?: string;
};

export const PostsSchema = SchemaFactory.createForClass(Posts);