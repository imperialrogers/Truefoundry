import { IsArray, IsEnum, IsNotEmpty, IsString, ValidateNested, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Type } from 'class-transformer';
import OpenAI from 'openai';
import { MetadataDto } from './metadata.dto';

export class ChatInputDto {
    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => MessageDto)
    messages: MessageDto[];

    @ValidateNested()
    @Type(() => MetadataDto)
    metadata: MetadataDto;
}

export class MessageDto {
    @IsNotEmpty()
    @IsEnum(["user", "system", "assistant"], {
        message: "role must be of type: user, system or assistant",
    })
    role: "user" | "system" | "assistant";

    @IsNotEmpty()
    @IsString()
    content: string;
}
