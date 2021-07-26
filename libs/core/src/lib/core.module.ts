import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";

import { configuration } from "./config/configuration";
import { validationSchema } from "./config/validation";
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    DatabaseModule
  ],
  controllers: [],
  providers: [],
  exports: [DatabaseModule]
})
export class CoreModule {
}
