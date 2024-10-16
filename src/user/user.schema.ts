import { Document } from "mongoose";
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {
  @Prop({ unique: true, required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, enum: ["admin", "user", "doctor"], default: "user" })
  role: string;

  @Prop({ required: true, trim: true })
  fullname: string;

  @Prop({ trim: true, lowercase: true, index: true })
  normalizedFullname?: string;

  @Prop()
  isVerified?: boolean;

  @Prop()
  password?: string;

  @Prop({ trim: true })
  address?: string;

  @Prop({ trim: true })
  province?: string;

  @Prop({ match: /^[0-9]+$/, trim: true })
  phoneNumber?: string;

  @Prop()
  dateOfBirth?: string;

  @Prop({ enum: ["male", "female"], default: "male" })
  gender?: string;

  @Prop()
  image?: string;

  @Prop()
  imageName?: string;

  @Prop()
  otp?: string;
};

export const UserSchema = SchemaFactory.createForClass(User);