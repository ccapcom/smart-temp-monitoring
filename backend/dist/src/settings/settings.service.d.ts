import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationSchedulerService } from '../notifications/notification-scheduler.service';
export declare class SettingsService {
    private prisma;
    private scheduler;
    constructor(prisma: PrismaService, scheduler: NotificationSchedulerService);
    getSmtpConfig(): Promise<{
        password: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        username: string;
        host: string;
        port: number;
        fromEmail: string;
        useTls: boolean;
    } | null>;
    updateSmtpConfig(id: string, data: {
        host?: string;
        port?: number;
        username?: string;
        password?: string;
        fromEmail?: string;
        useTls?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        username: string;
        password: string;
        host: string;
        port: number;
        fromEmail: string;
        useTls: boolean;
    }>;
    getCronjobConfigs(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        cronExpression: string;
        isEnabled: boolean;
        lastRunAt: Date | null;
        nextRunAt: Date | null;
    }[]>;
    getCronjobConfig(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        cronExpression: string;
        isEnabled: boolean;
        lastRunAt: Date | null;
        nextRunAt: Date | null;
    }>;
    updateCronjobConfig(id: string, data: {
        cronExpression?: string;
        isEnabled?: boolean;
        description?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        cronExpression: string;
        isEnabled: boolean;
        lastRunAt: Date | null;
        nextRunAt: Date | null;
    }>;
    getAuditLogs(query: {
        page?: number;
        limit?: number;
        entity?: string;
        userId?: string;
    }): Promise<{
        data: ({
            user: {
                username: string;
                fullName: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            action: string;
            entity: string;
            entityId: string | null;
            oldValue: import("@prisma/client/runtime/library").JsonValue | null;
            newValue: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userId: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
