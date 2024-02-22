import { Controller, Get } from "@nestjs/common";
import { MailService } from "./mail.service";

@Controller("mail")
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get("/mail")
  async sendWelcomeEmail(): Promise<string> {
    const email = "your.mail@example.com";
    const name = "name";

    await this.mailService.sendEmail(email, name);

    return "Welcome email sent!";
  }
}
