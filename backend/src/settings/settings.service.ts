import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationSchedulerService } from '../notifications/notification-scheduler.service';

@Injectable()
export class SettingsService {
  constructor(
    private prisma: PrismaService,
    private scheduler: NotificationSchedulerService,
  ) {}

  // SMTP Config
  async getSmtpConfig() {
    const config = await this.prisma.smtpConfig.findFirst({ where: { isActive: true } });
    if (!config) return null;
    return { ...config, password: '********' };
  }

  async updateSmtpConfig(id: string, data: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    fromEmail?: string;
    useTls?: boolean;
  }) {
    const updateData: any = { ...data };
    if (data.password === '********') delete updateData.password;
    return this.prisma.smtpConfig.update({ where: { id }, data: updateData });
  }

  // Cronjob Config
  async getCronjobConfigs() {
    return this.prisma.cronjobConfig.findMany({ orderBy: { name: 'asc' } });
  }

  async getCronjobConfig(id: string) {
    const config = await this.prisma.cronjobConfig.findUnique({ where: { id } });
    if (!config) throw new NotFoundException('Cronjob config not found');
    return config;
  }

  async updateCronjobConfig(id: string, data: {
    cronExpression?: string;
    isEnabled?: boolean;
    description?: string;
  }) {
    const config = await this.prisma.cronjobConfig.update({ where: { id }, data });

    if (data.cronExpression || data.isEnabled !== undefined) {
      if (config.isEnabled) {
        this.scheduler.registerCron(config.name, config.cronExpression);
      }
    }

    return config;
  }

  // Audit logs
  async getAuditLogs(query: { page?: number; limit?: number; entity?: string; userId?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const where: any = {};
    if (query.entity) where.entity = query.entity;
    if (query.userId) where.userId = query.userId;

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: { user: { select: { fullName: true, username: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
