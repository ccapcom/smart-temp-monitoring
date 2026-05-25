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
var NotificationSchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const cron_1 = require("cron");
const prisma_service_1 = require("../common/prisma/prisma.service");
const mail_service_1 = require("./mail.service");
let NotificationSchedulerService = NotificationSchedulerService_1 = class NotificationSchedulerService {
    constructor(prisma, mailService, schedulerRegistry) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.schedulerRegistry = schedulerRegistry;
        this.logger = new common_1.Logger(NotificationSchedulerService_1.name);
    }
    async onModuleInit() {
        await this.loadDynamicCrons();
    }
    async loadDynamicCrons() {
        const configs = await this.prisma.cronjobConfig.findMany({ where: { isEnabled: true } });
        for (const config of configs) {
            this.registerCron(config.name, config.cronExpression);
        }
    }
    registerCron(name, expression) {
        try {
            if (this.schedulerRegistry.doesExist('cron', name)) {
                this.schedulerRegistry.deleteCronJob(name);
            }
        }
        catch { }
        const job = new cron_1.CronJob(expression, () => this.runSubmissionCheck(name));
        this.schedulerRegistry.addCronJob(name, job);
        job.start();
        this.logger.log(`Registered cron job: ${name} (${expression})`);
    }
    async runSubmissionCheck(jobName) {
        this.logger.log(`Running submission check${jobName ? ` (${jobName})` : ''}`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const departments = await this.prisma.department.findMany({
            where: { isActive: true, emailRecipients: { isEmpty: false } },
        });
        const submissions = await this.prisma.formSubmission.findMany({
            where: { recordDate: { gte: today, lt: tomorrow } },
            select: { departmentId: true },
        });
        const submittedDeptIds = new Set(submissions.map((s) => s.departmentId));
        for (const dept of departments) {
            if (!submittedDeptIds.has(dept.id) && dept.emailRecipients.length > 0) {
                const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                await this.mailService.sendMail({
                    to: dept.emailRecipients,
                    cc: dept.emailCc,
                    bcc: dept.emailBcc,
                    subject: `[Smart Temp] Missing Temperature Submission - ${dept.name}`,
                    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc2626;">Temperature Data Not Submitted</h2>
              <p>Dear <strong>${dept.name}</strong> team,</p>
              <p>This is an automated reminder that temperature monitoring data for <strong>${dateStr}</strong> has not been submitted.</p>
              <p>Please submit the required temperature records as soon as possible.</p>
              <hr style="border: 1px solid #e5e7eb;" />
              <p style="color: #6b7280; font-size: 12px;">This is an automated notification from Smart Temperature Monitoring System.</p>
            </div>
          `,
                    departmentId: dept.id,
                });
            }
        }
        if (jobName) {
            await this.prisma.cronjobConfig.update({
                where: { name: jobName },
                data: { lastRunAt: new Date() },
            });
        }
        this.logger.log('Submission check completed');
    }
};
exports.NotificationSchedulerService = NotificationSchedulerService;
exports.NotificationSchedulerService = NotificationSchedulerService = NotificationSchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        schedule_1.SchedulerRegistry])
], NotificationSchedulerService);
//# sourceMappingURL=notification-scheduler.service.js.map