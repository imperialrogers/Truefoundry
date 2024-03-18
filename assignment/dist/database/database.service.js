"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@clickhouse/client");
const uuid_1 = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
let DatabaseService = class DatabaseService {
    constructor() {
        this.clickhhouseClient = (0, client_1.createClient)({
            host: this.getFromEnv("HOST"),
            username: 'default',
            password: this.getFromEnv("PASSWORD"),
            database: this.getFromEnv("DATABASE"),
        });
    }
    async uploadChat(data) {
        const { createdAt, prompt, response, latency, inputTokens, outputTokens, metadata, stream, engine, n, status_code } = data;
        try {
            const id = (0, uuid_1.v4)();
            await this.clickhhouseClient.insert({
                table: "chat",
                values: [{
                        id,
                        user: metadata.user,
                        env: metadata.env,
                        status_code: status_code ? 200 : 500,
                        createdAt: new Date(),
                        input: prompt,
                        output: response,
                        latency: latency,
                        inputTokens: inputTokens,
                        outputTokens: outputTokens,
                        stream: stream,
                    }],
                format: 'JSONEachRow'
            });
            await this.clickhhouseClient.insert({
                table: "metrics",
                values: [{
                        id,
                        user: metadata.user,
                        status_code: status_code ? 200 : 500,
                        env: metadata.env,
                        createdAt: createdAt,
                        model: metadata.model,
                        temperature: metadata.temperature,
                        max_tokens: metadata.max_tokens,
                        top_p: metadata.top_p,
                        frequency_penalty: metadata.frequency_penalty,
                        presence_penalty: metadata.presence_penalty,
                        metricslatency: latency,
                        inputTokens: inputTokens,
                        outputTokens: outputTokens,
                        engine: engine,
                        n: n
                    }],
                format: 'JSONEachRow'
            });
            console.log('Database updated successfully.');
            return 'Database successfully.';
        }
        catch (error) {
            console.error('Error inserting data into chats table:', error);
            throw error;
        }
    }
    getFromEnv(key) {
        if (process.env[key]) {
            return process.env[key];
        }
        console.error(`${key} environment variable should be set`);
        process.exit(1);
    }
    onApplicationShutdown(signal) {
        console.log('Application is shutting down...');
        this.closeClickHouseClient();
    }
    async onModuleDestroy() {
        console.log('DatabaseService is being destroyed');
        await this.closeClickHouseClient();
    }
    async closeClickHouseClient() {
        try {
            await this.clickhhouseClient.close();
            console.log('ClickHouse client closed successfully');
        }
        catch (error) {
            console.error('Error closing ClickHouse client:', error);
        }
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)()
], DatabaseService);
//# sourceMappingURL=database.service.js.map