import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DataInputDto } from './dto/data-input.dto';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Post()
  create(@Body(ValidationPipe) data:DataInputDto) {
    return this.databaseService.uploadChat(data);
  }
}
