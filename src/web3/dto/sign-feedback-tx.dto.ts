import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class SignFeedbackTxDto {
  @ApiProperty()
  @IsNumber()
  nonce: number;

  @ApiProperty()
  @IsString()
  infoHash: string;

  @ApiProperty()
  @IsString()
  serviceAddress: string;

  @ApiProperty()
  @IsNumber()
  score: number;
}
