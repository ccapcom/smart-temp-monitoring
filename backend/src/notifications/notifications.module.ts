import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { NotificationSchedulerService } from './notification-scheduler.service';
import { NotificationsController } from './notifications.controller';

@Module({
  controllers: [NotificationsController],
  providers: [MailService, NotificationSchedulerService],
  exports: [MailService, NotificationSchedulerService],
})
export class NotificationsModule {}
