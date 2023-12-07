import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/auth/decorators';
import { JwtUserDto } from 'src/auth/dtos';
import { RolesGuard } from 'src/auth/strategies';
import { FeedbackStatus, Role } from 'src/common/constants';
import { User } from 'src/user/decorators';
import { ExecuteFeedbackRequestDto, FeedbackRequestDto } from './dto';
import { FeedbackService } from './feedback.service';
@ApiTags('feedbacks')
@Controller('feedbacks')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}
  @HasRoles(Role.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('')
  submitFeedback(@Body() dto: FeedbackRequestDto, @User() user: JwtUserDto) {
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

  @ApiBearerAuth()
  @HasRoles(Role.SCRIPT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('execute')
  executeAddProjectTransactions(@Body() dto: ExecuteFeedbackRequestDto) {
    return this.feedbackService.executeRequests(
      dto.nonce,
      dto.score,
      dto.submitter,
      dto.service,
      dto.infoHash,
      dto.signature
    );
  }
}
