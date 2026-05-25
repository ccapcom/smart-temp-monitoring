import { PrismaService } from '../common/prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: PaginationDto): Promise<{
        data: {
            department: {
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
            } | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            isActive: boolean;
            username: string;
            fullName: string;
            email: string | null;
            role: import(".prisma/client").$Enums.Role;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        department: {
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
        } | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string | null;
        isActive: boolean;
        username: string;
        fullName: string;
        email: string | null;
        role: import(".prisma/client").$Enums.Role;
    }>;
    create(data: {
        username: string;
        password: string;
        fullName: string;
        email?: string;
        role?: any;
        departmentId?: string;
    }): Promise<{
        department: {
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
        } | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string | null;
        isActive: boolean;
        username: string;
        fullName: string;
        email: string | null;
        role: import(".prisma/client").$Enums.Role;
    }>;
    update(id: string, data: Partial<{
        fullName: string;
        email: string;
        role: any;
        departmentId: string;
        isActive: boolean;
    }>): Promise<{
        department: {
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
        } | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string | null;
        isActive: boolean;
        username: string;
        fullName: string;
        email: string | null;
        role: import(".prisma/client").$Enums.Role;
    }>;
    resetPassword(id: string, newPassword: string): Promise<{
        message: string;
    }>;
}
