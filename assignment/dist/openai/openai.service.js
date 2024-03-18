"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenaiService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
const chat_interface_1 = require("./interfaces/chat.interface");
const database_service_1 = require("../database/database.service");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
let listMessages = [];
let OpenaiService = class OpenaiService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async getMessageResponse(input) {
        try {
            const startTime = Date.now();
            const { metadata = {}, ...rest } = input;
            const inputMetadata = { ...chat_interface_1.defaultMetadata, ...metadata };
            listMessages = [...listMessages, { "role": "user", "content": input.messages[0].content }];
            var output = await this._openaiChatResponse(input, inputMetadata);
            var outputString = output.choices[0].message.content;
            const latency = Date.now() - startTime;
            const date = new Date();
            this.databaseService.uploadChat({
                createdAt: date,
                prompt: input.messages[0].content,
                response: outputString,
                latency: latency,
                inputTokens: this.calculateInputTokens(input.messages),
                outputTokens: this.calculateOutputTokens(outputString),
                metadata: inputMetadata,
                stream: false,
                engine: 'openai',
                n: 1,
                status_code: 200,
            });
            listMessages = [...listMessages, { "role": "assistant", "content": outputString }];
            return output;
        }
        catch (error) {
            this.databaseService.uploadChat({
                createdAt: new Date(),
                prompt: input.messages[0].content,
                response: error.message,
                latency: 0,
                inputTokens: 0,
                outputTokens: 0,
                metadata: chat_interface_1.defaultMetadata,
                stream: false,
                engine: 'openai',
                n: 1,
                status_code: 500,
            });
            throw error;
        }
    }
    async _openaiChatResponse(input, inputMetadata) {
        try {
            listMessages.push({ "role": "user", "content": input.messages[0].content });
            const receivedResponse = await openai.chat.completions.create({
                messages: listMessages,
                model: inputMetadata.model,
                temperature: inputMetadata.temperature,
                max_tokens: inputMetadata.max_tokens,
                top_p: inputMetadata.top_p,
                frequency_penalty: inputMetadata.frequency_penalty,
                presence_penalty: inputMetadata.presence_penalty,
            });
            listMessages = [
                ...listMessages,
                { "role": "assistant", "content": receivedResponse.choices[0].message.content }
            ];
            const ouptutString = receivedResponse.choices[0].message.content;
            return receivedResponse;
        }
        catch (error) {
            throw error;
        }
    }
    calculateOutputTokens(response) {
        const words = response.split(' ');
        return words.length;
    }
    calculateInputTokens(messages) {
        return messages.reduce((totalTokens, message) => {
            const words = message.content.split(' ');
            const messageTokens = words.length;
            return totalTokens + messageTokens;
        }, 0);
    }
};
exports.OpenaiService = OpenaiService;
exports.OpenaiService = OpenaiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], OpenaiService);
//# sourceMappingURL=openai.service.js.map