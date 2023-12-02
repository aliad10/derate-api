import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../database/database.repository';
import { Feedback, FeedbackDocument } from './schemas';
@Injectable()
export class FeedbackRepository extends EntityRepository<FeedbackDocument> {
  constructor(
    @InjectModel(Feedback.name)
    feedbackModel: Model<FeedbackDocument>
  ) {
    super(feedbackModel);
  }
}
