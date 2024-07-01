//app.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRootRoute() {
    return 'Welcome to the application!';
    // Or, if you prefer to redirect to another page:
    // return { redirect: '/some-other-page' };
  }
}