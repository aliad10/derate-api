import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';

import { Result } from 'src/database/interfaces/result.interface';
import { MailService } from 'src/mail/mail.service';
import { Web3Service } from 'src/web3/web3.service';
import { AuthErrorMessages, Messages, Numbers } from './../common/constants';
import {
  checkPublicKey,
  generateToken,
  getRandomNonce,
  recoverPublicAddressfromSignature,
  resultHandler,
} from './../common/helpers';
import { JwtUserDto } from './dtos';
import { GetLoginDto } from './dtos/get-login.dto';
import { GetNonceDto } from './dtos/get-nonce.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private web3Service: Web3Service
  ) {}

  async getNonce(wallet: string): Promise<Result<GetNonceDto>> {
    const userWallet = wallet.toLowerCase();

    if (!checkPublicKey(userWallet))
      throw new BadRequestException(AuthErrorMessages.INVALID_WALLET);

    let user = await this.userService.findUserByWallet(userWallet);

    const nonce = getRandomNonce();

    if (user.statusCode == 200) {
      return resultHandler(200, 'nonce generated', {
        message: Messages.SIGN_MESSAGE + user.data.nonce.toString(),
        userId: user.data._id,
      });
    }

    const result = await this.userService.create({
      nonce,
      walletAddress: userWallet,
    });

    return resultHandler(200, 'nonce generated', {
      message: Messages.SIGN_MESSAGE + result.data.nonce.toString(),
      userId: result.data._id,
    });
  }
  async loginWithWallet(
    walletAddress: string,
    signature: string
  ): Promise<Result<GetLoginDto>> {
    const userWallet = walletAddress.toLowerCase();
    if (!checkPublicKey(userWallet))
      throw new BadRequestException(AuthErrorMessages.INVALID_WALLET);

    const user = await this.userService.findUserByWallet(userWallet, {
      _id: 1,
      nonce: 1,
    });

    if (user.statusCode != 200)
      throw new NotFoundException(AuthErrorMessages.USER_NOT_EXIST);

    const message = Messages.SIGN_MESSAGE + user.data.nonce.toString();

    const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
    const recoveredAddress: string = recoverPublicAddressfromSignature(
      signature,
      msg
    );

    if (recoveredAddress.toLowerCase() !== userWallet)
      throw new ForbiddenException(AuthErrorMessages.INVALID_CREDENTIALS);

    const nonce: number = getRandomNonce();

    await this.userService.updateUserById(user.data._id, { nonce });

    return resultHandler(200, 'successful login', {
      access_token: await this.getAccessToken(user.data._id, userWallet),
    });
  }
  async verifyEmailRequest(user: JwtUserDto, email: string) {
    let userWithVerifiedEmailResult = await this.userService.findUser({
      email,
      emailVerified: true,
    });

    if (userWithVerifiedEmailResult.statusCode != 404) {
      throw new ForbiddenException('email in use');
    }

    const verificationCode = generateToken(100000, 999999);

    await this.mailService.sendEmail(email, verificationCode);

    await this.userService.updateUserById(user.userId, {
      emailCode: verificationCode,
      emailCodeIssuedAt: new Date(),
    });
  }
  async verifyEmail(user: JwtUserDto, code: string) {
    const userData = await this.userService.findUserById(user.userId);
    let userWithVerifiedEmailResult = await this.userService.findUser({
      email: userData.data.email,
      emailVerified: true,
    });

    if (userWithVerifiedEmailResult.statusCode != 404) {
      throw new ForbiddenException('email already verified');
    }
    const now = Date.now();

    if (
      userData.data.emailCodeIssuedAt.getTime() +
        Numbers.EMAIL_TOKEN_VALID_TIME <
      now
    ) {
      throw new ForbiddenException('token expired');
    }

    if (userData.data.emailCode !== code) {
      throw new ForbiddenException('invalid token');
    }

    await this.userService.updateUserById(user.userId, { emailVerified: true });
    return resultHandler(200, 'verified', '');
  }

  async connectTwitter(user: JwtUserDto, twitter: string) {
    const userWithTwitterAccount = await this.userService.findUser({
      twitter,
    });

    if (userWithTwitterAccount.statusCode != 404) {
      throw new ForbiddenException('twitter already connected');
    }

    await this.userService.updateUserById(user.userId, { twitter });
  }

  async getUserRole(user: JwtUserDto) {
    const userData = await this.userService.findUserById(user.userId);
    if (!userData.data.emailVerified || !userData.data.twitter) {
      throw new ForbiddenException('incomplete verification');
    }
    return await this.web3Service.grantUserRole(userData.data.walletAddress);
  }

  private async getAccessToken(
    userId: string,
    walletAddress: string
  ): Promise<string> {
    const payload = { userId, walletAddress };
    try {
      return this.jwtService.signAsync(payload, {
        expiresIn: 60 * 60 * 24 * 30,
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
