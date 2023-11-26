import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class UserDto {
  @IsString()
  @IsOptional()
  _id?;

  @IsString()
  @IsOptional()
  walletAddress?;

  @IsOptional()
  @IsEmail()
  @IsString()
  email?: string;

  @IsOptional()
  @IsNumber()
  nonce?: number;

  @IsOptional()
  @IsDate()
  updatedAt?;

  @IsOptional()
  @IsBoolean()
  emailVerified?;

  @IsOptional()
  @IsString()
  emailCode?;

  @IsOptional()
  @IsBoolean()
  emailCodeIssuedAt?;
}
