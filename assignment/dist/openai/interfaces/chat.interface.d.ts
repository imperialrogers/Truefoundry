import OpenAI from "openai";
export interface Metadata {
    user: string;
    env: "development" | "production" | "testing" | "others";
    model: string;
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
export declare const defaultMetadata: Metadata;
export interface ChatRequestInterface {
    messages: OpenAI.Chat.Completions.CreateChatCompletionRequestMessage[];
    metadata?: Metadata;
}
export interface ChatResponseInterface {
    status: boolean;
    result: string;
}
