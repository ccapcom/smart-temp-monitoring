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
exports.FormsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let FormsService = class FormsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTemplates() {
        return this.prisma.formTemplate.findMany({ where: { isActive: true }, orderBy: { code: 'asc' } });
    }
    async getTemplate(id) {
        const template = await this.prisma.formTemplate.findUnique({ where: { id } });
        if (!template)
            throw new common_1.NotFoundException('Form template not found');
        return template;
    }
    async submitForm(data) {
        return this.prisma.$transaction(async (tx) => {
            const submission = await tx.formSubmission.create({
                data: {
                    templateId: data.templateId,
                    departmentId: data.departmentId,
                    submittedById: data.submittedById,
                    recordDate: new Date(data.recordDate),
                    data: data.formData,
                    remarks: data.remarks,
                },
            });
            if (data.temperatureRecords?.length) {
                await tx.temperatureRecord.createMany({
                    data: data.temperatureRecords.map((r) => ({
                        submissionId: submission.id,
                        location: r.location,
                        recordDate: new Date(r.recordDate || data.recordDate),
                        timeSlot: r.timeSlot,
                        temperature: r.temperature != null ? parseFloat(r.temperature) : null,
                        humidity: r.humidity != null ? parseFloat(r.humidity) : null,
                        isAbnormal: r.isAbnormal || false,
                        remarks: r.remarks,
                    })),
                });
            }
            return this.getSubmission(submission.id);
        });
    }
    async getSubmissions(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const where = {};
        if (query.departmentId)
            where.departmentId = query.departmentId;
        if (query.templateId)
            where.templateId = query.templateId;
        if (query.startDate || query.endDate) {
            where.recordDate = {};
            if (query.startDate)
                where.recordDate.gte = new Date(query.startDate);
            if (query.endDate)
                where.recordDate.lte = new Date(query.endDate);
        }
        const [data, total] = await Promise.all([
            this.prisma.formSubmission.findMany({
                where,
                include: {
                    template: { select: { code: true, name: true, category: true } },
                    department: { select: { code: true, name: true } },
                    submittedBy: { select: { fullName: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { recordDate: 'desc' },
            }),
            this.prisma.formSubmission.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async getSubmission(id) {
        const submission = await this.prisma.formSubmission.findUnique({
            where: { id },
            include: {
                template: true,
                department: true,
                submittedBy: { select: { id: true, fullName: true, username: true } },
                records: { orderBy: [{ recordDate: 'asc' }, { timeSlot: 'asc' }] },
            },
        });
        if (!submission)
            throw new common_1.NotFoundException('Submission not found');
        return submission;
    }
    async updateSubmission(id, data) {
        return this.prisma.$transaction(async (tx) => {
            await tx.formSubmission.update({
                where: { id },
                data: {
                    ...(data.formData && { data: data.formData }),
                    ...(data.remarks !== undefined && { remarks: data.remarks }),
                },
            });
            if (data.temperatureRecords) {
                await tx.temperatureRecord.deleteMany({ where: { submissionId: id } });
                await tx.temperatureRecord.createMany({
                    data: data.temperatureRecords.map((r) => ({
                        submissionId: id,
                        location: r.location,
                        recordDate: new Date(r.recordDate),
                        timeSlot: r.timeSlot,
                        temperature: r.temperature != null ? parseFloat(r.temperature) : null,
                        humidity: r.humidity != null ? parseFloat(r.humidity) : null,
                        isAbnormal: r.isAbnormal || false,
                        remarks: r.remarks,
                    })),
                });
            }
            return this.getSubmission(id);
        });
    }
    async getDepartmentSubmissionStatus(date) {
        const targetDate = new Date(date);
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
        const departments = await this.prisma.department.findMany({
            where: { isActive: true },
            select: { id: true, code: true, name: true, category: true, emailRecipients: true },
        });
        const submissions = await this.prisma.formSubmission.findMany({
            where: { recordDate: { gte: startOfDay, lte: endOfDay } },
            select: { departmentId: true },
        });
        const submittedDeptIds = new Set(submissions.map((s) => s.departmentId));
        return departments.map((dept) => ({
            ...dept,
            hasSubmitted: submittedDeptIds.has(dept.id),
        }));
    }
};
exports.FormsService = FormsService;
exports.FormsService = FormsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FormsService);
//# sourceMappingURL=forms.service.js.map