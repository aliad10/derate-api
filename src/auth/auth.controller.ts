import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Result } from 'src/database/interfaces/result.interface';
import { AuthService } from './auth.service';
import { LoginWithWalletDto } from './dtos';
import { GetNonceDto } from './dtos/get-nonce.dto';
@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('nonce/:wallet')
  getNonce(@Param('wallet') wallet: string): Promise<Result<GetNonceDto>> {
    return this.authService.getNonce(wallet);
  }

  //------------------------------------------ ************************ ------------------------------------------//

  @Post('email-verify-request/:email')
  emailVerificationRequest(@Param('email') email: string) {
    return this.authService.verifyEmailRequest(email);
  }

  @Post('login/:wallet')
  emailVerification(
    @Param('wallet') wallet: string,
    @Body() dto: LoginWithWalletDto
  ) {}
}
