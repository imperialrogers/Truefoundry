import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenaiModule } from './openai/openai.module';
import { DatabaseModule } from './database/database.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [OpenaiModule, DatabaseModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService, DatabaseModule, OpenaiModule],
})
export class AppModule {}
