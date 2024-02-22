import { ApiResponseProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

export class GetUserMeDto {
  @IsString()
  @ApiResponseProperty()
  id?: string;

  @IsString()
  @ApiResponseProperty()
  walletAddress: string;

  @IsDate()
  @ApiResponseProperty()
  createdAt: Date;

  @IsDate()
  @ApiResponseProperty()
  updatedAt: Date;
}
