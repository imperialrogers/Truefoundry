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

export const defaultMetadata: Metadata = {
    user: "anonymous",
    env: "development",
    model: "gpt-3.5-turbo",
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
};

export interface ChatRequestInterface{
    messages: OpenAI.Chat.Completions.CreateChatCompletionRequestMessage[]
    metadata?:Metadata,
}

export interface ChatResponseInterface{
    status: boolean,
    result: string,
}