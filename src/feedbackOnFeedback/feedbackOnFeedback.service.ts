import { ForbiddenException, Injectable } from '@nestjs/common';

import { Web3Service } from 'src/web3/web3.service';
import { JwtUserDto } from '../auth/dtos';
import { Role, SignerRecoverySelector } from '../common/constants';
import { checkUserTx, getSigner, resultHandler } from '../common/helpers';
import { UserService } from '../user/user.service';
import {
  ExecuteFeedbackOnFeedbackRequestsBatchDto,
  FeedbackOnFeedbackRequestDto,
} from './dto';

import { FeedbackOnFeedbackRepository } from './feedbackOnFeedback.repository';
import { FeedbackOnFeedback } from './schemas';

@Injectable()
export class FeedbackOnFeedbackService {
  constructor(
    private feedbackOnFeedbackRepository: FeedbackOnFeedbackRepository,
    private userService: UserService,
    private web3Service: Web3Service
  ) {}

  async submitFeedbackOnFeedbackRequest(
    dto: FeedbackOnFeedbackRequestDto,
    user: JwtUserDto
  ): Promise<FeedbackOnFeedback> {
    let userData = await this.userService.findUserById(user.userId, {
      feedbackOnFeedBackNonce: 1,
      userRole: 1,
      _id: 0,
    });

    if (userData.data.userRole != Role.USER) {
      throw new ForbiddenException('invalid role');
    }

    const signer = getSigner(
      dto.signature,
      {
        nonce: userData.data.feedbackOnFeedBackNonce,
        score: dto.score,
        infoHash: dto.infoHash,
        prevSubmitter: dto.prevSubmitter,
        serviceAddress: dto.serviceAddress,
      },
      SignerRecoverySelector.FEEDBACK_ON_FEEDBACK
    );

    if (signer.toLowerCase() !== user.walletAddress.toLowerCase())
      throw new ForbiddenException('invalid signer');

    const feedbackData = await this.web3Service.getFeedbackOnFeedbackData(
      signer,
      dto.prevSubmitter,
      dto.serviceAddress
    );

    if (feedbackData.exists)
      throw new ForbiddenException('feedback already submitted');

    let validToSubmitFeedback = await checkUserTx(
      signer,
      dto.serviceAddress,
      100
    );

    if (!validToSubmitFeedback) {
      throw new ForbiddenException("user does't interact with service");
    }

    const createdData = await this.feedbackOnFeedbackRepository.create({
      ...dto,
      signer,
      nonce: userData.data.feedbackOnFeedBackNonce,
    });

    await this.userService.updateUserById(user.userId, {
      feedbackOnFeedBackNonce: userData.data.feedbackOnFeedBackNonce + 1,
    });

    return createdData;
  }

  async updateStatus(signer: string, nonce: number, status) {
    const result = await this.feedbackOnFeedbackRepository.findOneAndUpdate(
      { signer, nonce },
      { $set: { status } }
    );
    return resultHandler(200, 'status updated', result);
  }

  async executeRequests(
    nonce: number,
    score: number,
    prevSubmitter: string,
    submitter: string,
    service: string,
    infoHash: string,
    signature: string
  ) {
    const r = '0x' + signature.substring(0, 64);
    const s = '0x' + signature.substring(64, 128);
    const v = parseInt(signature.substring(128, 130), 16);

    await this.web3Service.executeAddFeedbackOnFeedback(
      nonce,
      score,
      prevSubmitter,
      submitter,
      service,
      infoHash,
      v,
      r,
      s
    );
  }

  async executeRequestsBatch(
    inputs: ExecuteFeedbackOnFeedbackRequestsBatchDto[]
  ) {
    let finalData = [];

    inputs.map((item1) => {
      let finalDataMember = [];
      let tempData = [];
      finalDataMember[0] = item1.submitter;

      // item.submitter
      item1.data.map((item2, index2) => {
        const r = '0x' + item2.signature.substring(0, 64);
        const s = '0x' + item2.signature.substring(64, 128);
        const v = parseInt(item2.signature.substring(128, 130), 16);

        tempData[index2] = [
          item2.nonce,
          item2.score,
          item2.prevSubmitter,
          item2.service,
          item2.infoHash,
          v,
          r,
          s,
        ];
      });
      finalDataMember[1] = tempData;
      finalData.push(finalDataMember);
    });

    await this.web3Service.executeAddFeedbackOnFeedbackBatch(finalData);
    return 'executed';
  }
  async getFeedbackOnFeedbackSubmissionRequests(
    filter,
    sortOption,
    projection?
  ): Promise<FeedbackOnFeedback[]> {
    return await this.feedbackOnFeedbackRepository.sort(
      filter,
      sortOption,
      projection
    );
  }
}
