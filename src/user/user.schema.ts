import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";

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

  @Prop()
  phoneNumber?: string;

  @Prop()
  dateOfBirth?: string;

  @Prop()
  gender?: string;

  @Prop()
  image?: string;

  @Prop()
  otp?: string;
};

export const UserSchema = SchemaFactory.createForClass(User);