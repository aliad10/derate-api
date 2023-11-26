// auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('')
export class TwitterController {
  @Get('twitter')
  @UseGuards(AuthGuard('twitter'))
  async twitterLogin() {}

  @Get('twitter/return')
  @UseGuards(AuthGuard('twitter'))
  async twitterLoginCallback(@Req() req, @Res() res) {
    // Successful authentication, redirect home
    const user = req.user;
    console.log('user', user);
    res.send(user ? `Hello, ${user.displayName}!` : 'Home Page');

    // res.redirect('/');
  }
}
