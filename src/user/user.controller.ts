import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";
import { SwaggerErrors } from "src/common/constants";
import { User } from "./decorators";
import { JwtUserDto } from "src/auth/dtos";
import { GetUserMeResultDto } from "./dtos";

@ApiTags("user")
@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get("/me")
  getMe(@User() user: JwtUserDto) {
    return this.userService.getUserData(user.userId);
  }
}
