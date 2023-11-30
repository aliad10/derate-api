import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PlatformStatus } from 'src/common/constants';

export type PlatformDocument = Platform & Document;

@Schema()
export class Platform extends Document {
  @Prop({ type: String, required: true })
  signer;

  @Prop({ type: Number, required: true })
  nonce;

  @Prop({ type: String, required: true })
  infoHash;

  @Prop({ type: String, required: true })
  serviceAddress;

  @Prop({ type: String, required: true })
  signature;

  @Prop({ type: Number, required: true, default: PlatformStatus.PENDING })
  status;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt;

  @Prop({ type: Date, required: true, default: Date.now })
  updatedAt;
}

export const PlatformSchema = SchemaFactory.createForClass(Platform);
