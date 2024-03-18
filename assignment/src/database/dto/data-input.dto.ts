import { IsDate, IsNotEmpty, IsString, IsNumber, IsBoolean, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Metadata } from 'src/openai/interfaces/chat.interface';
import { MetadataDto } from 'src/openai/dto/metadata.dto';

export class DataInputDto {
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    createdAt: Date;

    @IsString()
    @IsNotEmpty()
    prompt: string;

    @IsString()
    @IsNotEmpty()
    response: string;

    @IsNumber()
    @Min(0)
    latency: number;

    @IsNumber()
    @Min(0)
    inputTokens: number;

    @IsNumber()
    @Min(0)
    outputTokens: number;

    @ValidateNested()
    @Type(() => MetadataDto)
    metadata: Metadata;

    @IsBoolean()
    stream: boolean;

    @IsNotEmpty()
    @IsString()
    engine: string;

    @IsNumber()
    @Min(0)
    n: number;

    @IsNotEmpty()
    @IsInt()
    @Min(100)
    status_code: number;
}
