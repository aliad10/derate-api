import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateUserDto {
  @IsOptional()
  @IsEmail()
  @IsString()
  email?;

  @IsOptional()
  @IsBoolean()
  emailVerified?;

  @IsOptional()
  @IsDate()
  createdAt?;

  @IsOptional()
  @IsDate()
  updatedAt?;

  @IsOptional()
  @IsString()
  walletAddress?;

  @IsNumber()
  nonce: number;
}
