import { PrismaService } from '../common/prisma/prisma.service';
export declare class MailService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private getTransporter;
    sendMail(options: {
        to: string[];
        cc?: string[];
        bcc?: string[];
        subject: string;
        html: string;
        departmentId?: string;
    }): Promise<void>;
    testConnection(): Promise<{
        success: boolean;
        message: any;
    }>;
}
