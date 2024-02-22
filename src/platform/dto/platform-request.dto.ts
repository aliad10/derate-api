import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PlatformRequestDto {
  @ApiProperty()
  @IsString()
  infoHash: string;

  @ApiProperty()
  @IsString()
  serviceAddress: string;

  @ApiProperty()
  @IsString()
  signature: string;
}
