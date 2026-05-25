import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class GraphsService {
  constructor(private prisma: PrismaService) {}

  async getTemperatureTrend(query: {
    departmentId?: string;
    location?: string;
    startDate: string;
    endDate: string;
    templateId?: string;
  }) {
    const where: any = {
      recordDate: {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      },
    };
    if (query.location) where.location = query.location;
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

  async getDashboardSummary(departmentId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const where: any = {};
    if (departmentId) where.departmentId = departmentId;

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

  async getLocations(departmentId?: string) {
    const where: any = {};
    if (departmentId) where.submission = { departmentId };

    const records = await this.prisma.temperatureRecord.findMany({
      where,
      select: { location: true },
      distinct: ['location'],
    });
    return records.map((r) => r.location);
  }
}
