import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GraphsService } from './graphs.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Graphs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('graphs')
export class GraphsController {
  constructor(private graphsService: GraphsService) {}

  @Get('temperature-trend')
  @ApiOperation({ summary: 'Get temperature trend data for charts' })
  getTemperatureTrend(@Query() query: any) {
    return this.graphsService.getTemperatureTrend(query);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard summary data' })
  getDashboard(@Request() req: any, @Query('departmentId') departmentId?: string) {
    return this.graphsService.getDashboardSummary(departmentId || req.user.departmentId);
  }

  @Get('locations')
  @ApiOperation({ summary: 'Get available recording locations' })
  getLocations(@Query('departmentId') departmentId?: string) {
    return this.graphsService.getLocations(departmentId);
  }
}
