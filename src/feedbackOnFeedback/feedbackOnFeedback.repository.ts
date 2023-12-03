import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../database/database.repository';
import { FeedbackOnFeedback, FeedbackOnFeedbackDocument } from './schemas';
@Injectable()
export class FeedbackOnFeedbackRepository extends EntityRepository<FeedbackOnFeedbackDocument> {
  constructor(
    @InjectModel(FeedbackOnFeedback.name)
    feedbackOnFeedbackModel: Model<FeedbackOnFeedbackDocument>
  ) {
    super(feedbackOnFeedbackModel);
  }
}
