import { Controller, Get } from '@nestjs/common';

import { FilmService } from './film.service';

@Controller('film')
export class filmController {
  constructor(private readonly filmService: FilmService) {}

  @Get('count')
  getCount() {
    return this.filmService.getCount();
  }
  @Get('latest')
  getLatest(pageSize?: number) {
    return this.filmService.getLatest(pageSize);
  }
}
