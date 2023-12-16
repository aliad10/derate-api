import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { HasRoles } from "src/auth/decorators";
import { JwtUserDto } from "src/auth/dtos";
import { RolesGuard } from "src/auth/strategies";
import { PlatformStatus, Role } from "src/common/constants";
import { User } from "src/user/decorators";
import { ExecuteRequestDto } from "./dto";
import { PlatformRequestDto } from "./dto/platform-request.dto";
import { PlatformService } from "./platform.service";
@ApiTags("services")
@Controller("services")
export class PlatformController {
  constructor(private platformService: PlatformService) {}
  @ApiBearerAuth()
  @HasRoles(Role.USER)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Post("")
  addService(@Body() dto: PlatformRequestDto, @User() user: JwtUserDto) {
    return this.platformService.addPlatform(dto, user);
  }
  @ApiBearerAuth()
  @HasRoles(Role.SCRIPT)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Patch("/:id/reject")
  rejectPlant(@Param("id") id: string) {
    return this.platformService.rejectPlatform(id);
  }

  @ApiBearerAuth()
  @HasRoles(Role.SCRIPT)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Get("verification-list")
  getAssignedTreeRequests() {
    return this.platformService.getPlatformSubmissionRequests(
      { status: PlatformStatus.PENDING },
      { signer: 1, nonce: 1 },
      {}
    );
  }

  @ApiBearerAuth()
  @HasRoles(Role.SCRIPT)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Post("execute")
  executeAddProjectTransactions(@Body() dto: ExecuteRequestDto) {
    return this.platformService.executeRequests(
      dto.nonce,
      dto.submitter,
      dto.service,
      dto.infoHash,
      dto.signature
    );
  }
}
