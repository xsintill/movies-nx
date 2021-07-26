import { Module } from '@nestjs/common';

import { CoreModule } from '@lsn/core';
import { FilmService } from './film.service';
import { filmController } from './film.controller';
@Module({
  imports: [CoreModule],
  controllers: [filmController],
  providers: [FilmService],
  exports: []
})
export class FilmModule {}
