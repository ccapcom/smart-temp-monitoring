import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            username: string;
            fullName: string;
            email: string | null;
            role: import(".prisma/client").$Enums.Role;
            departmentId: string | null;
            departmentName: string | undefined;
        };
    }>;
    validateUser(userId: string): Promise<({
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string | null;
        isActive: boolean;
        username: string;
        password: string;
        fullName: string;
        email: string | null;
        role: import(".prisma/client").$Enums.Role;
    }) | null>;
}
