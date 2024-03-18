import OpenAI from "openai";
import { ChatRequestInterface, Metadata } from './interfaces/chat.interface';
import { DatabaseService } from 'src/database/database.service';
import { ChatInputDto } from './dto/chatinput.dto';
export declare class OpenaiService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    getMessageResponse(input: ChatInputDto): Promise<OpenAI.Chat.Completions.ChatCompletion>;
    _openaiChatResponse(input: ChatRequestInterface, inputMetadata: Metadata): Promise<OpenAI.Chat.Completions.ChatCompletion>;
    calculateOutputTokens(response: string): number;
    calculateInputTokens(messages: OpenAI.Chat.Completions.CreateChatCompletionRequestMessage[]): number;
}
