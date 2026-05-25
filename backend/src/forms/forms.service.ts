import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  async getTemplates() {
    return this.prisma.formTemplate.findMany({ where: { isActive: true }, orderBy: { code: 'asc' } });
  }

  async getTemplate(id: string) {
    const template = await this.prisma.formTemplate.findUnique({ where: { id } });
    if (!template) throw new NotFoundException('Form template not found');
    return template;
  }

  async submitForm(data: {
    templateId: string;
    departmentId: string;
    submittedById: string;
    recordDate: string;
    formData: any;
    temperatureRecords?: any[];
    remarks?: string;
  }) {
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

  async getSubmissions(query: {
    departmentId?: string;
    templateId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const where: any = {};
    if (query.departmentId) where.departmentId = query.departmentId;
    if (query.templateId) where.templateId = query.templateId;
    if (query.startDate || query.endDate) {
      where.recordDate = {};
      if (query.startDate) where.recordDate.gte = new Date(query.startDate);
      if (query.endDate) where.recordDate.lte = new Date(query.endDate);
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

  async getSubmission(id: string) {
    const submission = await this.prisma.formSubmission.findUnique({
      where: { id },
      include: {
        template: true,
        department: true,
        submittedBy: { select: { id: true, fullName: true, username: true } },
        records: { orderBy: [{ recordDate: 'asc' }, { timeSlot: 'asc' }] },
      },
    });
    if (!submission) throw new NotFoundException('Submission not found');
    return submission;
  }

  async updateSubmission(id: string, data: { formData?: any; remarks?: string; temperatureRecords?: any[] }) {
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

  async getDepartmentSubmissionStatus(date: string) {
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
}
