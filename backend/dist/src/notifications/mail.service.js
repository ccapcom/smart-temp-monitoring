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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const prisma_service_1 = require("../common/prisma/prisma.service");
let MailService = MailService_1 = class MailService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(MailService_1.name);
    }
    async getTransporter() {
        const config = await this.prisma.smtpConfig.findFirst({ where: { isActive: true } });
        if (!config)
            throw new Error('No active SMTP configuration found');
        return {
            transporter: nodemailer.createTransport({
                host: config.host,
                port: config.port,
                secure: config.port === 465,
                auth: config.username ? { user: config.username, pass: config.password } : undefined,
                tls: config.useTls ? { rejectUnauthorized: false } : undefined,
            }),
            fromEmail: config.fromEmail,
        };
    }
    async sendMail(options) {
        try {
            const { transporter, fromEmail } = await this.getTransporter();
            await transporter.sendMail({
                from: fromEmail,
                to: options.to.join(','),
                cc: options.cc?.join(','),
                bcc: options.bcc?.join(','),
                subject: options.subject,
                html: options.html,
            });
            await this.prisma.emailLog.create({
                data: {
                    departmentId: options.departmentId,
                    recipients: options.to,
                    subject: options.subject,
                    body: options.html,
                    status: 'sent',
                },
            });
            this.logger.log(`Email sent to ${options.to.join(', ')}`);
        }
        catch (error) {
            await this.prisma.emailLog.create({
                data: {
                    departmentId: options.departmentId,
                    recipients: options.to,
                    subject: options.subject,
                    body: options.html,
                    status: 'failed',
                    errorMessage: error.message,
                },
            });
            this.logger.error(`Failed to send email: ${error.message}`);
            throw error;
        }
    }
    async testConnection() {
        try {
            const { transporter } = await this.getTransporter();
            await transporter.verify();
            return { success: true, message: 'SMTP connection successful' };
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MailService);
//# sourceMappingURL=mail.service.js.map