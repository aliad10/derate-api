import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PlatformRepository } from './platform.repository';

import { Web3Service } from 'src/web3/web3.service';
import { JwtUserDto } from '../auth/dtos';
import {
  PlatformStatus,
  Role,
  SignerRecoverySelector,
} from '../common/constants';
import { getSigner, resultHandler } from '../common/helpers';
import { UserService } from '../user/user.service';

import { ExecuteRequestsBatchDto } from './dto';
import { PlatformRequestDto } from './dto/platform-request.dto';
import { Platform } from './schemas';

@Injectable()
export class PlatformService {
  constructor(
    private platformRepository: PlatformRepository,
    private userService: UserService,
    private web3Service: Web3Service
  ) {}

  async addPlatform(
    dto: PlatformRequestDto,
    user: JwtUserDto
  ): Promise<Platform> {
    let userData = await this.userService.findUserById(user.userId, {
      serviceNonce: 1,
      userRole: 1,
      _id: 0,
    });

    if (userData.data.userRole != Role.USER) {
      throw new ForbiddenException('invalid role');
    }

    const signer = getSigner(
      dto.signature,
      {
        nonce: userData.data.serviceNonce,
        infoHash: dto.infoHash,
        serviceAddress: dto.serviceAddress,
      },
      SignerRecoverySelector.SERVICE
    );

    if (signer.toLowerCase() !== user.walletAddress.toLowerCase())
      throw new ForbiddenException('invalid signer');

    let serviceRequest = await this.platformRepository.findOne({
      serviceAddress: dto.serviceAddress,
      status: { $in: [PlatformStatus.PENDING, PlatformStatus.ACCEPTED] },
    });

    if (serviceRequest) {
      throw new ForbiddenException('service request exists');
    }

    const serviceData = await this.web3Service.getServiceData(
      dto.serviceAddress
    );

    if (serviceData.exists)
      throw new ForbiddenException('service already exists');

    const createdData = await this.platformRepository.create({
      ...dto,
      signer: user.walletAddress,
      nonce: userData.data.serviceNonce,
    });

    await this.userService.updateUserById(user.userId, {
      serviceNonce: userData.data.serviceNonce + 1,
    });

    return createdData;
  }

  async rejectPlatform(platformId: string) {
    const platformData = await this.platformRepository.findOne({
      _id: platformId,
    });

    if (!platformData) throw new NotFoundException('not found');

    if (platformData.status != PlatformStatus.PENDING)
      throw new ConflictException('invalid status');

    await this.platformRepository.updateOne(
      { _id: platformId },
      { $set: { status: PlatformStatus.REJECTED } }
    );

    return resultHandler(200, 'platform rejected', '');
  }

  async updateStatus(signer: string, nonce: number, status) {
    const result = await this.platformRepository.findOneAndUpdate(
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

    await this.web3Service.executeAddService(
      nonce,
      submitter,
      service,
      infoHash,
      v,
      r,
      s
    );
  }

  async executeRequestsBatch(inputs: ExecuteRequestsBatchDto[]) {
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

    await this.web3Service.executeAddServiceBatch(finalData);
  }

  async getPlatformSubmissionRequests(
    filter,
    sortOption,
    projection?
  ): Promise<Platform[]> {
    return await this.platformRepository.sort(filter, sortOption, projection);
  }
}
