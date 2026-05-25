import { Controller, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('smtp')
  @ApiOperation({ summary: 'Get SMTP configuration' })
  getSmtp() {
    return this.settingsService.getSmtpConfig();
  }

  @Put('smtp/:id')
  @ApiOperation({ summary: 'Update SMTP configuration' })
  updateSmtp(@Param('id') id: string, @Body() body: any) {
    return this.settingsService.updateSmtpConfig(id, body);
  }

  @Get('cronjobs')
  @ApiOperation({ summary: 'List cronjob configurations' })
  getCronjobs() {
    return this.settingsService.getCronjobConfigs();
  }

  @Get('cronjobs/:id')
  @ApiOperation({ summary: 'Get cronjob configuration' })
  getCronjob(@Param('id') id: string) {
    return this.settingsService.getCronjobConfig(id);
  }

  @Put('cronjobs/:id')
  @ApiOperation({ summary: 'Update cronjob configuration' })
  updateCronjob(@Param('id') id: string, @Body() body: any) {
    return this.settingsService.updateCronjobConfig(id, body);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs' })
  getAuditLogs(@Query() query: any) {
    return this.settingsService.getAuditLogs(query);
  }
}
