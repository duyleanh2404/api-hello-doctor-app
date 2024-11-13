import { Document } from "mongoose";
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  doctor_id: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, index: true })
  normalizedFullname: string;

  @Prop({ required: true })
  role: string;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop()
  password: string;

  @Prop()
  province: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  dateOfBirth: string;

  @Prop()
  image: string;

  @Prop()
  imageName: string;

  @Prop()
  otp: string;

  @Prop()
  otpExpires: Date;

  @Prop()
  isVerified: boolean;
};

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ normalizedName: 1 });