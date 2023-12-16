import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { HasRoles } from "src/auth/decorators";
import { JwtUserDto } from "src/auth/dtos";
import { RolesGuard } from "src/auth/strategies";
import { PlatformStatus, Role } from "src/common/constants";
import { User } from "src/user/decorators";
import {
  ExecuteFeedbackOnFeedbackRequestDto,
  FeedbackOnFeedbackRequestDto,
} from "./dto";
import { FeedbackOnFeedbackService } from "./feedbackOnFeedback.service";
@ApiTags("feedbacks-on-feedback")
@Controller("feedbacks-on-feedback")
export class FeedbackOnFeedbackController {
  constructor(private feedbackService: FeedbackOnFeedbackService) {}
  @ApiBearerAuth()
  @HasRoles(Role.USER)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Post("")
  submitFeedback(
    @Body() dto: FeedbackOnFeedbackRequestDto,
    @User() user: JwtUserDto
  ) {
    return this.feedbackService.submitFeedbackOnFeedbackRequest(dto, user);
  }

  @HasRoles(Role.SCRIPT)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Get("verification-list")
  getFeedbacksForVerification() {
    return this.feedbackService.getFeedbackOnFeedbackSubmissionRequests(
      { status: PlatformStatus.PENDING },
      { signer: 1, nonce: 1 },
      {}
    );
  }

  @ApiBearerAuth()
  @HasRoles(Role.SCRIPT)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Post("execute")
  executeAddProjectTransactions(
    @Body() dto: ExecuteFeedbackOnFeedbackRequestDto
  ) {
    return this.feedbackService.executeRequests(
      dto.nonce,
      dto.score,
      dto.prevSubmitter,
      dto.submitter,
      dto.service,
      dto.infoHash,
      dto.signature
    );
  }
}
