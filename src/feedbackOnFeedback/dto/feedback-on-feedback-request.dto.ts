import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FeedbackOnFeedbackRequestDto {
  @ApiProperty()
  @IsString()
  infoHash: string;

  @ApiProperty()
  @IsString()
  serviceAddress: string;

  @ApiProperty()
  @IsString()
  prevSubmitter: string;
  @ApiProperty()
  @IsString()
  signature: string;
}
