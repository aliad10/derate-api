import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { Web3Module } from 'src/web3/web3.module';
import { FeedbackOnFeedbackController } from './feedbackOnFeedback.controller';
import { FeedbackOnFeedbackRepository } from './feedbackOnFeedback.repository';
import { FeedbackOnFeedbackService } from './feedbackOnFeedback.service';
import { FeedbackOnFeedback, FeedbackOnFeedbackSchema } from './schemas';

@Module({
  imports: [
    UserModule,
    AuthModule,
    Web3Module,
    DatabaseModule,
    MongooseModule.forFeature([
      { name: FeedbackOnFeedback.name, schema: FeedbackOnFeedbackSchema },
    ]),
  ],
  controllers: [FeedbackOnFeedbackController],
  providers: [FeedbackOnFeedbackService, FeedbackOnFeedbackRepository],
  exports: [FeedbackOnFeedbackService],
})
export class FeedbackOnFeedbackModule {}
