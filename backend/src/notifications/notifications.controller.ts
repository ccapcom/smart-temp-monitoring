import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { MailService } from './mail.service';
import { NotificationSchedulerService } from './notification-scheduler.service';
import { PrismaService } from '../common/prisma/prisma.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private mailService: MailService,
    private scheduler: NotificationSchedulerService,
    private prisma: PrismaService,
  ) {}

  @Post('test-connection')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Test SMTP connection' })
  testConnection() {
    return this.mailService.testConnection();
  }

  @Post('trigger')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Manually trigger notification check' })
  async triggerCheck() {
    await this.scheduler.runSubmissionCheck();
    return { message: 'Notification check triggered' };
  }

  @Get('logs')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get email notification logs' })
  async getLogs(@Query() query: { page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;

    const [data, total] = await Promise.all([
      this.prisma.emailLog.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { sentAt: 'desc' },
      }),
      this.prisma.emailLog.count(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
