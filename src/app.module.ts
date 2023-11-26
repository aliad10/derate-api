import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { TwitterModule } from './twitter/twitter.module';
import { SessionModule } from 'nestjs-session';

@Module({
  imports: [
    MailModule,
    TwitterModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SessionModule.forRoot({
      session: {
        secret: "",
        resave: true,
        saveUninitialized: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
