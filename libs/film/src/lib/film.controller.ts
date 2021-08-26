import { Controller, Get, Post, Query, Body, Delete, Param } from '@nestjs/common';

import { FilmService } from './film.service';
import { DbMovie } from './film.type';

@Controller('film')
export class filmController {
  constructor(private readonly filmService: FilmService) {}

  @Get('count')
  async getCount() {
    return await this.filmService.getCount();
  }

  @Get('getWordCount')
  async getWordCount(@Query('word') word: string) {
    return await this.filmService.getWordCount(word);
  }
  
  @Get('latest')
  async getLatest(
    @Query('search') search: string = '', 
    @Query('pageIndex') pageIndex?: number,
    @Query('pageSize') pageSize?: number) {
    return await this.filmService.getLatest(search, pageIndex, pageSize);
  }

  @Post('add')
  async add(@Body() movie: DbMovie){
    return await this.filmService.add(movie);
  }

  @Delete('remove/:id')
  async remove(@Param('id') id: number){
    return await this.filmService.remove(id);
  }
}
