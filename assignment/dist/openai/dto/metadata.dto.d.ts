export declare class MetadataDto {
    user: string;
    env: "development" | "production" | "testing" | "others";
    model: string;
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
