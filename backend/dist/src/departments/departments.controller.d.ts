import { DepartmentsService } from './departments.service';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class DepartmentsController {
    private departmentsService;
    constructor(departmentsService: DepartmentsService);
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
    listCategories(): Promise<string[]>;
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
    create(body: any): Promise<{
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
    update(id: string, body: any): Promise<{
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
}
