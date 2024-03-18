import { MetadataDto } from './metadata.dto';
export declare class ChatInputDto {
    messages: MessageDto[];
    metadata: MetadataDto;
}
export declare class MessageDto {
    role: "user" | "system" | "assistant";
    content: string;
}
