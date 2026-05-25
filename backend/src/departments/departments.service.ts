import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto & { category?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const { search, category } = query;
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) where.category = category;

    const [data, total] = await Promise.all([
      this.prisma.department.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { code: 'asc' },
      }),
      this.prisma.department.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const dept = await this.prisma.department.findUnique({ where: { id } });
    if (!dept) throw new NotFoundException('Department not found');
    return dept;
  }

  async create(data: {
    code: string;
    name: string;
    category: string;
    emailRecipients?: string[];
    emailCc?: string[];
    emailBcc?: string[];
  }) {
    return this.prisma.department.create({
      data: {
        ...data,
        emailRecipients: data.emailRecipients || [],
        emailCc: data.emailCc || [],
        emailBcc: data.emailBcc || [],
      },
    });
  }

  async update(id: string, data: Partial<{
    name: string;
    category: string;
    emailRecipients: string[];
    emailCc: string[];
    emailBcc: string[];
    isActive: boolean;
  }>) {
    return this.prisma.department.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.prisma.department.delete({ where: { id } });
    return { message: 'Department deleted' };
  }

  async listCategories() {
    const result = await this.prisma.department.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    return result.map((r) => r.category);
  }
}
