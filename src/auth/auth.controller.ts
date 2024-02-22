import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/database/interfaces/result.interface';
import { User } from 'src/user/decorators';
import { AuthService } from './auth.service';
import { JwtUserDto, LoginWithWalletDto } from './dtos';
import { GetNonceDto } from './dtos/get-nonce.dto';
@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('nonce/:wallet')
  getNonce(@Param('wallet') wallet: string): Promise<Result<GetNonceDto>> {
    return this.authService.getNonce(wallet);
  }

  @Post('login/:wallet')
  loginWithWallet(
    @Param('wallet') wallet: string,
    @Body() dto: LoginWithWalletDto
  ) {
    const signature: string = dto.signature;
    return this.authService.loginWithWallet(wallet, signature);
  }
  //------------------------------------------ ************************ ------------------------------------------//

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('email-verify-request/:email')
  emailVerificationRequest(
    @User() user: JwtUserDto,
    @Param('email') email: string
  ) {
    return this.authService.verifyEmailRequest(user, email);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('email-verify/:token')
  emailVerification(@User() user: JwtUserDto, @Param('token') token: string) {
    return this.authService.verifyEmail(user, token);
  }

  @Get('twitter')
  @UseGuards(AuthGuard('twitter'))
  async twitterLogin() {}

  @Get('twitter/return')
  @UseGuards(AuthGuard('twitter'))
  async twitterLoginCallback(@Req() req, @Res() res) {
    const user = req.user;

    this.authService.connectTwitter(user.username);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('request-user-role')
  requestUserRole(@User() user: JwtUserDto) {
    return this.authService.getUserRole(user);
  }
}
