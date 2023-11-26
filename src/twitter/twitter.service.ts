import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class TwitterService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Our App',
      template: './welcome', // The name of your email template file (e.g., welcome.pug)
      context: { name }, // Data to pass to the template
    });
  }
}
