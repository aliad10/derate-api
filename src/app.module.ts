import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SessionModule } from "nestjs-session";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { FeedbackModule } from "./feedback/platform.module";
import { FeedbackOnFeedbackModule } from "./feedbackOnFeedback/feedbackOnFeedback.module";
import { GraphModule } from "./graph/graph.module";
import { MailModule } from "./mail/mail.module";
import { PlatformModule } from "./platform/platform.module";

@Module({
  imports: [
    MailModule,

    AuthModule,
    PlatformModule,
    FeedbackModule,
    FeedbackOnFeedbackModule,
    GraphModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SessionModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        session: {
          secret: configService.get<string>("SESSION_SECRET"),
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
