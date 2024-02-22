import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ExecuteFeedbackOnFeedbackRequestDto {
  @ApiProperty()
  @IsNumber()
  nonce: number;

  @ApiProperty()
  @IsNumber()
  score: number;

  @ApiProperty()
  @IsString()
  prevSubmitter: string;

  @ApiProperty()
  @IsString()
  submitter: string;
  @ApiProperty()
  @IsString()
  service: string;
  @ApiProperty()
  @IsString()
  infoHash: string;

  @ApiProperty()
  @IsString()
  signature: string;
}
