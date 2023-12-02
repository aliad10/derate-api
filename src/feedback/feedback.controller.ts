import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/auth/decorators';
import { JwtUserDto } from 'src/auth/dtos';
import { RolesGuard } from 'src/auth/strategies';
import { FeedbackStatus, Role } from 'src/common/constants';
import { User } from 'src/user/decorators';
import { PlatformRequestDto } from './dto/platform-request.dto';
import { FeedbackService } from './feedback.service';
@ApiTags('feedbacks')
@Controller('feedbacks')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}
  @HasRoles(Role.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('')
  submitFeedback(@Body() dto: PlatformRequestDto, @User() user: JwtUserDto) {
    return this.feedbackService.submitFeedbackRequest(dto, user);
  }

  @HasRoles(Role.SCRIPT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('verification-list')
  getFeedbacksForVerification() {
    return this.feedbackService.getFeedbackSubmissionRequests(
      { status: FeedbackStatus.PENDING },
      { signer: 1, nonce: 1 },
      {}
    );
  }
}
