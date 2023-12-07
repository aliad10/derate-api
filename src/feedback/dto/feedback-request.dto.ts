import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class FeedbackRequestDto {
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
  signature: string;
}
