import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): any;
}
