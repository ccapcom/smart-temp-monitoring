import { PrismaService } from '../common/prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class DepartmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: PaginationDto & {
        category?: string;
    }): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
            category: string;
            emailRecipients: string[];
            emailCc: string[];
            emailBcc: string[];
            isActive: boolean;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        category: string;
        emailRecipients: string[];
        emailCc: string[];
        emailBcc: string[];
        isActive: boolean;
    }>;
    create(data: {
        code: string;
        name: string;
        category: string;
        emailRecipients?: string[];
        emailCc?: string[];
        emailBcc?: string[];
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        category: string;
        emailRecipients: string[];
        emailCc: string[];
        emailBcc: string[];
        isActive: boolean;
    }>;
    update(id: string, data: Partial<{
        name: string;
        category: string;
        emailRecipients: string[];
        emailCc: string[];
        emailBcc: string[];
        isActive: boolean;
    }>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        category: string;
        emailRecipients: string[];
        emailCc: string[];
        emailBcc: string[];
        isActive: boolean;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
    listCategories(): Promise<string[]>;
}
