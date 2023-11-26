// auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TwitterStrategy } from './twitter.guard';
import { TwitterController } from './twitter.controller';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'twitter' })],
  controllers: [TwitterController],
  providers: [TwitterStrategy],
})
export class TwitterModule {}
