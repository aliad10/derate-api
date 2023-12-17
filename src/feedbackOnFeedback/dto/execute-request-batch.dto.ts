import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString } from 'class-validator';

class DataDto {
  @IsInt()
  @ApiProperty()
  nonce: number;
  @IsInt()
  @ApiProperty()
  score: number;

  @IsString()
  @ApiProperty()
  prevSubmitter: string;

  @IsString()
  @ApiProperty()
  service: string;

  @IsString()
  @ApiProperty()
  infoHash: string;

  @IsString()
  @ApiProperty()
  signature: string;
}

export class ExecuteFeedbackOnFeedbackRequestsBatchDto {
  @IsString()
  @ApiProperty()
  submitter: string;

  @IsArray()
  @ApiProperty()
  data: DataDto[];
}
