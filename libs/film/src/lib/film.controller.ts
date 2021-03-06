import { Controller, Get, Post, Put, Query, Body, Delete, Param } from '@nestjs/common';

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

  @Get('getAllOcurring2and3LetterCombos')
  async getAllOcurring2and3LetterCombos() {
    return await this.filmService.getAllOcurring2and3LetterCombos();
  }
  
  @Get('getFilmsForWord')
  async getFilmsForWord(@Query('word') word: string) {
    return await this.filmService.getFilmsForWord(word);
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
  
  @Put('update')
  async update(@Body() movie: DbMovie){
    return await this.filmService.update(movie);
  }

  @Delete('remove/:id')
  async remove(@Param('id') id: number){
    return await this.filmService.remove(id);
  }
}
