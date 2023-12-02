import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FeedbackStatus } from 'src/common/constants';

export type FeedbackDocument = Feedback & Document;

@Schema()
export class Feedback extends Document {
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

  @Prop({ type: Number, required: true, default: FeedbackStatus.PENDING })
  status;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt;

  @Prop({ type: Date, required: true, default: Date.now })
  updatedAt;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
