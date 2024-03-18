export interface FiltersDto {
    id?: string;
    user?: string;
    env?: string;
    status_code?: number;
    input?: string;
    output?: string;
    createdAt?: {
        start: string;
        end: string;
    };
    model?: string;
    temperature?: {
        min: number;
        max: number;
    };
    max_tokens?: {
        min: number;
        max: number;
    };
    top_p?: {
        min: number;
        max: number;
    };
    frequency_penalty?: {
        min: number;
        max: number;
    };
    presence_penalty?: {
        min: number;
        max: number;
    };
    metricslatency?: {
        min: number;
        max: number;
    };
    inputTokens?: {
        min: number;
        max: number;
    };
    outputTokens?: {
        min: number;
        max: number;
    };
    engine?: string;
}
