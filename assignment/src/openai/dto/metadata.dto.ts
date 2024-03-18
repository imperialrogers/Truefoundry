import { IsString, IsIn, IsOptional, IsNumber, Min, IsNotEmpty, IsEnum, Max, IsInt } from 'class-validator';

export class MetadataDto {
    @IsNotEmpty()
    @IsString()
    user: string;

    @IsNotEmpty()
    @IsEnum(["development", "production", "testing", "others"], {
        message: "env must be one of the following: development, production, testing, others",
    })
    env: "development" | "production" | "testing" | "others";

    @IsNotEmpty()
    @IsEnum(["gpt-3.5-turbo",
     "gpt-3.5-turbo-1106",
     "gpt-3.5-turbo-0613",
     "gpt-3.5-turbo-0301",
     "gpt-3.5-turbo-0125",
     "gpt-3.5-turbo-16k",
     "gpt-3.5-turbo-16k-0613"], {
        message: "Models must must be one of the following: gpt-3.5-turbo, gpt-3.5-turbo-1106,gpt-3.5-turbo-0613,gpt-3.5-turbo-0301,gpt-3.5-turbo-0125,gpt-3.5-turbo-16k,gpt-3.5-turbo-16k-0613"})
    model: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(2)
    temperature?: number;

    @IsInt()
    @IsOptional()
    @Min(1)
    @Max(4096)
    max_tokens?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1)
    top_p?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(2)
    frequency_penalty?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(2)
    presence_penalty?: number;
}