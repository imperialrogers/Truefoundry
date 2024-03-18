import { Injectable } from '@nestjs/common';
import OpenAI from "openai";
import { ChatRequestInterface, Metadata, defaultMetadata } from './interfaces/chat.interface';
import { DatabaseService } from 'src/database/database.service';
import { ChatInputDto } from './dto/chatinput.dto';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

let listMessages=[];

@Injectable()
export class OpenaiService {
    constructor(private readonly databaseService: DatabaseService) {}
    //Function to get the response from OpenAI
    async getMessageResponse(input:ChatInputDto){
        try {
            const startTime = Date.now();
            const {metadata={}, ...rest} = input;
            const inputMetadata={...defaultMetadata, ...metadata};
            listMessages=[...listMessages, {"role":"user", "content":input.messages[0].content}];
            //OpenAI API call
            var output = await this._openaiChatResponse(input, inputMetadata);
            var outputString = output.choices[0].message.content;
            const latency = Date.now() - startTime;
            // Insert entry in database
            const date=new Date();
            this.databaseService.uploadChat({
                createdAt: date,
                prompt: input.messages[0].content,
                response: outputString,
                latency: latency,
                inputTokens: this.calculateInputTokens(input.messages[0].content),
                outputTokens: this.calculateOutputTokens(outputString),
                metadata: inputMetadata,
                stream: false,
                engine: 'openai',
                n: 1,
                status_code:200,
            });
            listMessages=[...listMessages, {"role":"assistant", "content":outputString}];
            return output; 
        } catch (error) {
            //Log errors into database
            this.databaseService.uploadChat({
                createdAt: new Date(),
                prompt: input.messages[0].content,
                response: error.message,
                latency: 0,
                inputTokens: 0,
                outputTokens: 0,
                metadata: defaultMetadata,
                stream: false,
                engine: 'openai',
                n: 1,
                status_code: 500,
            });
            throw error;
        }
    }

    //Open AI Call
    async _openaiChatResponse(input:ChatRequestInterface, inputMetadata:Metadata):Promise<OpenAI.Chat.Completions.ChatCompletion>{
        try {
            listMessages.push({"role":"user", "content":input.messages[0].content});
            const receivedResponse = await openai.chat.completions.create({
                messages: listMessages,
                model: inputMetadata.model,
                temperature: inputMetadata.temperature,
                max_tokens: inputMetadata.max_tokens,
                top_p: inputMetadata.top_p,
                frequency_penalty: inputMetadata.frequency_penalty,
                presence_penalty: inputMetadata.presence_penalty,
            });
            listMessages=[
                ...listMessages,
                {"role":"assistant", "content":receivedResponse.choices[0].message.content}
            ];
            const ouptutString=receivedResponse.choices[0].message.content;
            return receivedResponse;
        } catch (error) {
            throw error;
        }
    }

    calculateOutputTokens(response: string) {
        const words = response.split(' ');
        return words.length;
    }

    calculateInputTokens(messages: string) {
        const words = messages.split(' ');
        return words.length;
    }
}