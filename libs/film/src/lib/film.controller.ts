import { Controller, Get, Query } from '@nestjs/common';

import { FilmService } from './film.service';

@Controller('film')
export class filmController {
  constructor(private readonly filmService: FilmService) {}

  @Get('count')
  getCount() {
    return this.filmService.getCount();
  }
  
  @Get('latest')
  getLatest(
    @Query('search') search: string = '', 
    @Query('pageSize') pageSize?: number) {
    return this.filmService.getLatest(search, pageSize);
  }
}
