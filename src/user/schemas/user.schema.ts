import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({ type: String, unique: true, required: true })
  walletAddress;

  @Prop({ type: Number, required: true })
  nonce;

  @Prop({ type: String })
  twitter;

  @Prop({ type: String })
  email;

  @Prop({ type: Date })
  emailVerifiedAt;

  @Prop({ type: Number })
  emailCode;

  @Prop({ type: Date })
  emailCodeIssuedAt;

  @Prop({ type: Date, default: () => new Date(), required: true })
  createdAt;

  @Prop({ type: Date, default: () => new Date(), required: true })
  updatedAt;
}

export const UserSchema = SchemaFactory.createForClass(User);