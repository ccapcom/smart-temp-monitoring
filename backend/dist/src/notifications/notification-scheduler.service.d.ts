import { SchedulerRegistry } from '@nestjs/schedule';
import { PrismaService } from '../common/prisma/prisma.service';
import { MailService } from './mail.service';
export declare class NotificationSchedulerService {
    private prisma;
    private mailService;
    private schedulerRegistry;
    private readonly logger;
    constructor(prisma: PrismaService, mailService: MailService, schedulerRegistry: SchedulerRegistry);
    onModuleInit(): Promise<void>;
    private loadDynamicCrons;
    registerCron(name: string, expression: string): void;
    runSubmissionCheck(jobName?: string): Promise<void>;
}
