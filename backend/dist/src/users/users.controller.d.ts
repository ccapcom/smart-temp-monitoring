import { UsersService } from './users.service';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
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
    create(body: {
        username: string;
        password: string;
        fullName: string;
        email?: string;
        role?: string;
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
    update(id: string, body: any): Promise<{
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
    resetPassword(id: string, body: {
        password: string;
    }): Promise<{
        message: string;
    }>;
}
