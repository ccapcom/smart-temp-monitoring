import { PrismaService } from '../common/prisma/prisma.service';
export declare class GraphsService {
    private prisma;
    constructor(prisma: PrismaService);
    getTemperatureTrend(query: {
        departmentId?: string;
        location?: string;
        startDate: string;
        endDate: string;
        templateId?: string;
    }): Promise<{
        id: string;
        date: Date;
        timeSlot: string;
        temperature: number | null;
        humidity: number | null;
        location: string;
        isAbnormal: boolean;
        department: string;
        formType: import(".prisma/client").$Enums.FormCategory;
    }[]>;
    getDashboardSummary(departmentId?: string): Promise<{
        todaySubmissions: number;
        totalSubmissions30d: number;
        abnormalRecords30d: number;
        recentSubmissions: ({
            template: {
                name: string;
                code: string;
            };
            department: {
                name: string;
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
    }>;
    getLocations(departmentId?: string): Promise<string[]>;
}
