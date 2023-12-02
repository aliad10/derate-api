import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PlatformRepository } from './platform.repository';

import { Web3Service } from 'src/web3/web3.service';
import { JwtUserDto } from '../auth/dtos';
import { PlatformStatus, SignerRecoverySelector } from '../common/constants';
import { getSigner, resultHandler } from '../common/helpers';
import { UserService } from '../user/user.service';

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
      _id: 0,
    });

    const signer = getSigner(
      dto.signature,
      {
        nonce: userData.data.serviceNonce,
        infoHash: dto.infoHash,
        serviceAddress: dto.serviceAddress,
      },
      SignerRecoverySelector.SERVICE
    );

    if (signer !== user.walletAddress)
      throw new ForbiddenException('invalid signer');

    const serviceData = await this.web3Service.getServiceData(
      dto.serviceAddress
    );

    if (serviceData.exists)
      throw new ForbiddenException('service already exists');

    const createdData = await this.platformRepository.create({
      ...dto,
      signer,
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
  async getPlatformSubmissionRequests(
    filter,
    sortOption,
    projection?
  ): Promise<Platform[]> {
    return await this.platformRepository.sort(filter, sortOption, projection);
  }
}
