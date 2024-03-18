import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export enum GptModels {
    "gpt-3.5-turbo",
     "gpt-3.5-turbo-1106",
     "gpt-3.5-turbo-0613",
     "gpt-3.5-turbo-0301",
     "gpt-3.5-turbo-0125",
     "gpt-3.5-turbo-16k",
     "gpt-3.5-turbo-16k-0613"
}

export const corsOptions: CorsOptions = {
    origin: true
  };