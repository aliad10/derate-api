import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class FeedbackOnFeedbackRequestDto {
  @ApiProperty()
  @IsNumber()
  score: number;

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
