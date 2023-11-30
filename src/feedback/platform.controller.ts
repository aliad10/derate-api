import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/auth/decorators';
import { JwtUserDto } from 'src/auth/dtos';
import { RolesGuard } from 'src/auth/strategies';
import { PlatformStatus, Role } from 'src/common/constants';
import { User } from 'src/user/decorators';
import { PlatformRequestDto } from './dto/platform-request.dto';
import { PlatformService } from './platform.service';
@ApiTags('services')
@Controller('services')
export class PlatformController {
  constructor(private platformService: PlatformService) {}
  @HasRoles(Role.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('')
  addService(@Body() dto: PlatformRequestDto, @User() user: JwtUserDto) {
    return this.platformService.addPlatform(dto, user);
  }

  @HasRoles(Role.SCRIPT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('/:id/reject')
  rejectPlant(@Param('id') id: string) {
    return this.platformService.rejectPlatform(id);
  }

  @HasRoles(Role.SCRIPT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('verification-list')
  getAssignedTreeRequests() {
    return this.platformService.getPlatformSubmissionRequests(
      { status: PlatformStatus.PENDING },
      { signer: 1, nonce: 1 },
      {}
    );
  }
}
