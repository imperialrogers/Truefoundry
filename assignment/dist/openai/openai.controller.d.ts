import { OpenaiService } from './openai.service';
import { ChatInputDto } from './dto/chatinput.dto';
export declare class OpenaiController {
    private readonly openaiService;
    constructor(openaiService: OpenaiService);
    create(chatInputDto: ChatInputDto): Promise<import("openai/resources/chat").ChatCompletion>;
}
