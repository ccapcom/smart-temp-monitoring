"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const notification_scheduler_service_1 = require("../notifications/notification-scheduler.service");
let SettingsService = class SettingsService {
    constructor(prisma, scheduler) {
        this.prisma = prisma;
        this.scheduler = scheduler;
    }
    async getSmtpConfig() {
        const config = await this.prisma.smtpConfig.findFirst({ where: { isActive: true } });
        if (!config)
            return null;
        return { ...config, password: '********' };
    }
    async updateSmtpConfig(id, data) {
        const updateData = { ...data };
        if (data.password === '********')
            delete updateData.password;
        return this.prisma.smtpConfig.update({ where: { id }, data: updateData });
    }
    async getCronjobConfigs() {
        return this.prisma.cronjobConfig.findMany({ orderBy: { name: 'asc' } });
    }
    async getCronjobConfig(id) {
        const config = await this.prisma.cronjobConfig.findUnique({ where: { id } });
        if (!config)
            throw new common_1.NotFoundException('Cronjob config not found');
        return config;
    }
    async updateCronjobConfig(id, data) {
        const config = await this.prisma.cronjobConfig.update({ where: { id }, data });
        if (data.cronExpression || data.isEnabled !== undefined) {
            if (config.isEnabled) {
                this.scheduler.registerCron(config.name, config.cronExpression);
            }
        }
        return config;
    }
    async getAuditLogs(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const where = {};
        if (query.entity)
            where.entity = query.entity;
        if (query.userId)
            where.userId = query.userId;
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
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_scheduler_service_1.NotificationSchedulerService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map