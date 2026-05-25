import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { PrismaService } from '../common/prisma/prisma.service';
import { MailService } from './mail.service';

@Injectable()
export class NotificationSchedulerService {
  private readonly logger = new Logger(NotificationSchedulerService.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async onModuleInit() {
    await this.loadDynamicCrons();
  }

  private async loadDynamicCrons() {
    const configs = await this.prisma.cronjobConfig.findMany({ where: { isEnabled: true } });
    for (const config of configs) {
      this.registerCron(config.name, config.cronExpression);
    }
  }

  registerCron(name: string, expression: string) {
    try {
      if (this.schedulerRegistry.doesExist('cron', name)) {
        this.schedulerRegistry.deleteCronJob(name);
      }
    } catch {}

    const job = new CronJob(expression, () => this.runSubmissionCheck(name));
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
    this.logger.log(`Registered cron job: ${name} (${expression})`);
  }

  async runSubmissionCheck(jobName?: string) {
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
}
