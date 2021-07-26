import { Module } from '@nestjs/common';

import { CoreModule } from '@lsn/core';
import { FilmModule } from '@lsn/film';


@Module({
  imports: [CoreModule, FilmModule]
})
export class AppModule {}
