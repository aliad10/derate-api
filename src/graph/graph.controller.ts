import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GraphService } from './graph.service';
@ApiTags('graph')
@Controller('graph')
export class GraphController {
  constructor(private graphService: GraphService) {}

  @ApiOperation({ summary: 'get user reputation data' })
  @Get('/user-reputation/:id')
  getUserData(@Param('id') id: string) {
    return this.graphService.getUserData(id);
  }

  @ApiOperation({ summary: 'get service reputation data' })
  @Get('/service-reputation/:id')
  getServiceData(@Param('id') id: string) {
    return this.graphService.getServiceData(id);
  }
}
