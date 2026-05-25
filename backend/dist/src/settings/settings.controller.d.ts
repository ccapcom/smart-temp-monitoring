import { SettingsService } from './settings.service';
export declare class SettingsController {
    private settingsService;
    constructor(settingsService: SettingsService);
    getSmtp(): Promise<{
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
    updateSmtp(id: string, body: any): Promise<{
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
    getCronjobs(): Promise<{
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
    getCronjob(id: string): Promise<{
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
    updateCronjob(id: string, body: any): Promise<{
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
    getAuditLogs(query: any): Promise<{
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
