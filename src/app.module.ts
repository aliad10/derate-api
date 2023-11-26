import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionModule } from 'nestjs-session';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { TwitterModule } from './twitter/twitter.module';

@Module({
  imports: [
    MailModule,
    TwitterModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SessionModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        session: {
          secret: configService.get<string>('SESSION_SECRET'),
          resave: true,
          saveUninitialized: true,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
