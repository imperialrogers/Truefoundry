import { Metadata } from 'src/openai/interfaces/chat.interface';
export declare class DataInputDto {
    createdAt: Date;
    prompt: string;
    response: string;
    latency: number;
    inputTokens: number;
    outputTokens: number;
    metadata: Metadata;
    stream: boolean;
    engine: string;
    n: number;
    status_code: number;
}
