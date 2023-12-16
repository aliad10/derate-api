import { IsString, IsArray, ValidateNested, IsInt } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";

class DataDto {
  @IsInt()
  @ApiProperty()
  nonce: number;

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

export class ExecuteRequestsBatchDto {
  @IsString()
  @ApiProperty()
  submitter: string;

  @IsArray()
  @ApiProperty()
  data: DataDto;
}
