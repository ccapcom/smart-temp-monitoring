import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private prisma: PrismaService) {}

  private async getTransporter() {
    const config = await this.prisma.smtpConfig.findFirst({ where: { isActive: true } });
    if (!config) throw new Error('No active SMTP configuration found');

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

  async sendMail(options: {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    html: string;
    departmentId?: string;
  }) {
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
    } catch (error: any) {
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
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
}
