import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ExecuteRequestDto {
  @ApiProperty()
  @IsNumber()
  nonce: number;
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
