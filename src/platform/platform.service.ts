import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePlatformDto } from './dto';

import { PlatformRepository } from './platform.repository';

import { Web3Service } from 'src/web3/web3.service';
import { JwtUserDto } from '../auth/dtos';
import { SignerRecoverySelector } from '../common/constants';
import { getSigner } from '../common/helpers';
import { UserService } from '../user/user.service';

import { Platform } from './schemas';

@Injectable()
export class PlatformService {
  constructor(
    private platformRepository: PlatformRepository,
    private userService: UserService,
    private web3Service: Web3Service
  ) {}

  async addPlatform(
    dto: CreatePlatformDto,
    user: JwtUserDto
  ): Promise<Platform> {
    let userData = await this.userService.findUserById(user.userId, {
      plantingNonce: 1,
      _id: 0,
    });

    const signer = getSigner(
      dto.signature,
      {
        nonce: userData.data.serviceNonce,
        infoHash: dto.infoHash,
      },
      SignerRecoverySelector.SERVICE
    );

    if (signer !== user.walletAddress)
      throw new ForbiddenException('invalid signer');

    const serviceData = await this.web3Service.getServiceData(signer);

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
}
