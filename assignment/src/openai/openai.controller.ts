import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Ip, ValidationPipe } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { ChatInputDto } from './dto/chatinput.dto';

@Controller('openai')
export class OpenaiController {
    constructor(private readonly openaiService: OpenaiService) {}
    @Post()
    create(@Body(ValidationPipe) chatInputDto:ChatInputDto) {
        return this.openaiService.getMessageResponse(chatInputDto);
    }
}
