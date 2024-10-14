import { Document } from "mongoose";
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  fullname: string;

  @Prop()
  isVerified?: boolean;

  @Prop()
  password?: string;

  @Prop()
  address?: string;

  @Prop({ match: /^[0-9]+$/ })
  phoneNumber?: string;

  @Prop({ type: Date })
  dateOfBirth?: Date;

  @Prop({ enum: ["male", "female"] })
  gender?: string;

  @Prop()
  image?: string;

  @Prop()
  otp?: string;
};

export const UserSchema = SchemaFactory.createForClass(User);