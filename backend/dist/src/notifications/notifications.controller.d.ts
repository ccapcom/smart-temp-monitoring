import { MailService } from './mail.service';
import { NotificationSchedulerService } from './notification-scheduler.service';
import { PrismaService } from '../common/prisma/prisma.service';
export declare class NotificationsController {
    private mailService;
    private scheduler;
    private prisma;
    constructor(mailService: MailService, scheduler: NotificationSchedulerService, prisma: PrismaService);
    testConnection(): Promise<{
        success: boolean;
        message: any;
    }>;
    triggerCheck(): Promise<{
        message: string;
    }>;
    getLogs(query: {
        page?: number;
        limit?: number;
    }): Promise<{
        data: {
            id: string;
            status: string;
            departmentId: string | null;
            subject: string;
            recipients: string[];
            body: string;
            errorMessage: string | null;
            sentAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
