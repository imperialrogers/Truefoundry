import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
export declare enum GptModels {
    "gpt-3.5-turbo" = 0,
    "gpt-3.5-turbo-1106" = 1,
    "gpt-3.5-turbo-0613" = 2,
    "gpt-3.5-turbo-0301" = 3,
    "gpt-3.5-turbo-0125" = 4,
    "gpt-3.5-turbo-16k" = 5,
    "gpt-3.5-turbo-16k-0613" = 6
}
export declare const corsOptions: CorsOptions;
