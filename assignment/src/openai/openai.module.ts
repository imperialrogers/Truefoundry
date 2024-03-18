import { Module } from '@nestjs/common';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [OpenaiController],
  providers: [OpenaiService, DatabaseService]
})
export class OpenaiModule {}
