import { ForbiddenException, Injectable } from '@nestjs/common';

import { Web3Service } from 'src/web3/web3.service';
import { JwtUserDto } from '../auth/dtos';
import { SignerRecoverySelector } from '../common/constants';
import { getSigner, resultHandler } from '../common/helpers';
import { UserService } from '../user/user.service';

import { PlatformRequestDto } from './dto/platform-request.dto';
import { FeedbackRepository } from './feedback.repository';
import { Feedback } from './schemas';

@Injectable()
export class FeedbackService {
  constructor(
    private feedbackRepository: FeedbackRepository,
    private userService: UserService,
    private web3Service: Web3Service
  ) {}

  async submitFeedbackRequest(
    dto: PlatformRequestDto,
    user: JwtUserDto
  ): Promise<Feedback> {
    let userData = await this.userService.findUserById(user.userId, {
      feedbackNonce: 1,
      _id: 0,
    });

    const signer = getSigner(
      dto.signature,
      {
        nonce: userData.data.feedbackNonce,
        infoHash: dto.infoHash,
        serviceAddress: dto.serviceAddress,
      },
      SignerRecoverySelector.FEEDBACK
    );

    if (signer !== user.walletAddress)
      throw new ForbiddenException('invalid signer');

    const feedbackData = await this.web3Service.getFeedbackData(
      signer,
      dto.serviceAddress
    );

    if (feedbackData.exists)
      throw new ForbiddenException('feedback already submitted');

    const createdData = await this.feedbackRepository.create({
      ...dto,
      signer,
      nonce: userData.data.feedbackNonce,
    });

    await this.userService.updateUserById(user.userId, {
      feedbackNonce: userData.data.feedbackNonce + 1,
    });

    return createdData;
  }

  async updateStatus(signer: string, nonce: number, status) {
    const result = await this.feedbackRepository.findOneAndUpdate(
      { signer, nonce },
      { $set: { status } }
    );
    return resultHandler(200, 'status updated', result);
  }

  async executeRequests(
    nonce: number,
    submitter: string,
    service: string,
    infoHash: string,
    signature: string
  ) {
    const r = '0x' + signature.substring(0, 64);
    const s = '0x' + signature.substring(64, 128);
    const v = parseInt(signature.substring(128, 130), 16);

    await this.web3Service.executeAddFeedback(
      nonce,
      submitter,
      service,
      infoHash,
      v,
      r,
      s
    );
  }

  async getFeedbackSubmissionRequests(
    filter,
    sortOption,
    projection?
  ): Promise<Feedback[]> {
    return await this.feedbackRepository.sort(filter, sortOption, projection);
  }
}
