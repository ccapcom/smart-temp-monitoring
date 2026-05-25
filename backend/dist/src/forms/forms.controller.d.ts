import { FormsService } from './forms.service';
export declare class FormsController {
    private formsService;
    constructor(formsService: FormsService);
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
    submitForm(req: any, body: any): Promise<{
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
    getSubmissions(query: any): Promise<{
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
    updateSubmission(id: string, body: any): Promise<{
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
    getSubmissionStatus(date: string): Promise<{
        hasSubmitted: boolean;
        id: string;
        name: string;
        code: string;
        category: string;
        emailRecipients: string[];
    }[]>;
}
