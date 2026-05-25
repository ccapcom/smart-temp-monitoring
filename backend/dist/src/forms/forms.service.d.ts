import { PrismaService } from '../common/prisma/prisma.service';
export declare class FormsService {
    private prisma;
    constructor(prisma: PrismaService);
    getTemplates(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        category: import(".prisma/client").$Enums.FormCategory;
        isActive: boolean;
        description: string | null;
        fields: import("@prisma/client/runtime/library").JsonValue;
        version: number;
    }[]>;
    getTemplate(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        category: import(".prisma/client").$Enums.FormCategory;
        isActive: boolean;
        description: string | null;
        fields: import("@prisma/client/runtime/library").JsonValue;
        version: number;
    }>;
    submitForm(data: {
        templateId: string;
        departmentId: string;
        submittedById: string;
        recordDate: string;
        formData: any;
        temperatureRecords?: any[];
        remarks?: string;
    }): Promise<{
        template: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
            category: import(".prisma/client").$Enums.FormCategory;
            isActive: boolean;
            description: string | null;
            fields: import("@prisma/client/runtime/library").JsonValue;
            version: number;
        };
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
        };
        submittedBy: {
            id: string;
            username: string;
            fullName: string;
        };
        records: {
            id: string;
            recordDate: Date;
            remarks: string | null;
            createdAt: Date;
            temperature: number | null;
            humidity: number | null;
            timeSlot: string;
            submissionId: string;
            location: string;
            isAbnormal: boolean;
        }[];
    } & {
        data: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        recordDate: Date;
        remarks: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
        departmentId: string;
        submittedById: string;
    }>;
    getSubmissions(query: {
        departmentId?: string;
        templateId?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            template: {
                name: string;
                code: string;
                category: import(".prisma/client").$Enums.FormCategory;
            };
            department: {
                name: string;
                code: string;
            };
            submittedBy: {
                fullName: string;
            };
        } & {
            data: import("@prisma/client/runtime/library").JsonValue;
            id: string;
            recordDate: Date;
            remarks: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            templateId: string;
            departmentId: string;
            submittedById: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getSubmission(id: string): Promise<{
        template: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
            category: import(".prisma/client").$Enums.FormCategory;
            isActive: boolean;
            description: string | null;
            fields: import("@prisma/client/runtime/library").JsonValue;
            version: number;
        };
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
        };
        submittedBy: {
            id: string;
            username: string;
            fullName: string;
        };
        records: {
            id: string;
            recordDate: Date;
            remarks: string | null;
            createdAt: Date;
            temperature: number | null;
            humidity: number | null;
            timeSlot: string;
            submissionId: string;
            location: string;
            isAbnormal: boolean;
        }[];
    } & {
        data: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        recordDate: Date;
        remarks: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
        departmentId: string;
        submittedById: string;
    }>;
    updateSubmission(id: string, data: {
        formData?: any;
        remarks?: string;
        temperatureRecords?: any[];
    }): Promise<{
        template: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
            category: import(".prisma/client").$Enums.FormCategory;
            isActive: boolean;
            description: string | null;
            fields: import("@prisma/client/runtime/library").JsonValue;
            version: number;
        };
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
        };
        submittedBy: {
            id: string;
            username: string;
            fullName: string;
        };
        records: {
            id: string;
            recordDate: Date;
            remarks: string | null;
            createdAt: Date;
            temperature: number | null;
            humidity: number | null;
            timeSlot: string;
            submissionId: string;
            location: string;
            isAbnormal: boolean;
        }[];
    } & {
        data: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        recordDate: Date;
        remarks: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
        departmentId: string;
        submittedById: string;
    }>;
    getDepartmentSubmissionStatus(date: string): Promise<{
        hasSubmitted: boolean;
        id: string;
        name: string;
        code: string;
        category: string;
        emailRecipients: string[];
    }[]>;
}
