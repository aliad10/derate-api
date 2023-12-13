import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "./../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { MailModule } from "src/mail/mail.module";
import { Web3Module } from "src/web3/web3.module";
import { DatabaseModule } from "./../database/database.module";
import { UserMobileRepository } from "./auth.repository";
import { UserMobile, UserMobileSchema } from "./schemas";
import { AtStrategy, RolesGuard } from "./strategies";
import { TwitterStrategy } from "./strategies/twitter.guard";
@Module({
  imports: [
    UserModule,
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: UserMobile.name, schema: UserMobileSchema },
    ]),
    PassportModule.register({ defaultStrategy: "twitter" }),
    DatabaseModule,
    MailModule,
    Web3Module,
  ],
  controllers: [AuthController],
  providers: [
    UserMobileRepository,
    AuthService,
    ConfigService,
    AtStrategy,
    RolesGuard,
    TwitterStrategy,
  ],
  exports: [AuthService, AtStrategy, RolesGuard],
})
export class AuthModule {}
