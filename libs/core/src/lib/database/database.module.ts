import { Module } from '@nestjs/common';

import { databaseProviders } from './database.providers';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
  controllers: []
})
export class DatabaseModule {}