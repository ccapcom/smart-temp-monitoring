"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let GraphsService = class GraphsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTemperatureTrend(query) {
        const where = {
            recordDate: {
                gte: new Date(query.startDate),
                lte: new Date(query.endDate),
            },
        };
        if (query.location)
            where.location = query.location;
        if (query.departmentId) {
            where.submission = { departmentId: query.departmentId };
        }
        if (query.templateId) {
            where.submission = { ...where.submission, templateId: query.templateId };
        }
        const records = await this.prisma.temperatureRecord.findMany({
            where,
            orderBy: [{ recordDate: 'asc' }, { timeSlot: 'asc' }],
            include: {
                submission: {
                    select: {
                        department: { select: { name: true, code: true } },
                        template: { select: { name: true, category: true } },
                    },
                },
            },
        });
        return records.map((r) => ({
            id: r.id,
            date: r.recordDate,
            timeSlot: r.timeSlot,
            temperature: r.temperature,
            humidity: r.humidity,
            location: r.location,
            isAbnormal: r.isAbnormal,
            department: r.submission.department.name,
            formType: r.submission.template.category,
        }));
    }
    async getDashboardSummary(departmentId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const where = {};
        if (departmentId)
            where.departmentId = departmentId;
        const [todaySubmissions, totalSubmissions, abnormalRecords, recentSubmissions] = await Promise.all([
            this.prisma.formSubmission.count({
                where: { ...where, recordDate: { gte: today, lt: tomorrow } },
            }),
            this.prisma.formSubmission.count({
                where: { ...where, recordDate: { gte: thirtyDaysAgo } },
            }),
            this.prisma.temperatureRecord.count({
                where: {
                    isAbnormal: true,
                    recordDate: { gte: thirtyDaysAgo },
                    ...(departmentId && { submission: { departmentId } }),
                },
            }),
            this.prisma.formSubmission.findMany({
                where: { ...where },
                include: {
                    template: { select: { name: true, code: true } },
                    department: { select: { name: true } },
                    submittedBy: { select: { fullName: true } },
                },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
        ]);
        return {
            todaySubmissions,
            totalSubmissions30d: totalSubmissions,
            abnormalRecords30d: abnormalRecords,
            recentSubmissions,
        };
    }
    async getLocations(departmentId) {
        const where = {};
        if (departmentId)
            where.submission = { departmentId };
        const records = await this.prisma.temperatureRecord.findMany({
            where,
            select: { location: true },
            distinct: ['location'],
        });
        return records.map((r) => r.location);
    }
};
exports.GraphsService = GraphsService;
exports.GraphsService = GraphsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GraphsService);
//# sourceMappingURL=graphs.service.js.map