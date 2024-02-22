import { ApiResponseProperty } from "@nestjs/swagger";

import { IResult } from "src/database/interfaces/IResult.interface";
import { GetUserMeDto } from "./get-user-me.dto";

export class GetUserMeResultDto extends IResult {
  @ApiResponseProperty()
  data: GetUserMeDto;
}
