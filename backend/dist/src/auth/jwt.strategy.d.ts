import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private authService;
    constructor(configService: ConfigService, authService: AuthService);
    validate(payload: {
        sub: string;
        role: string;
        departmentId?: string;
    }): Promise<{
        departmentId: string | undefined;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        username: string;
        password: string;
        fullName: string;
        email: string | null;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
export {};
