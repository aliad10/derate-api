// twitter.strategy.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Import ConfigService to get Twitter API keys
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-twitter';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor(private readonly configService: ConfigService) {
    super({
      consumerKey: configService.get('TWITTER_CONSUMER_KEY'),
      consumerSecret: configService.get('TWITTER_CONSUMER_SECRET'),
      callbackURL: 'http://localhost:3000/twitter/return',
      passReqToCallback: true,
      includeEmail: true,
    });
  }

  async validate(
    req: any,
    token: string,
    tokenSecret: string,
    profile: any,
    done: any
  ): Promise<any> {
    // Validate and process the user profile, save to the database, etc.
    return done(null, profile);
  }
}
