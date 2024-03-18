import { Injectable, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';
import { createClient } from '@clickhouse/client'
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import { DataInputDto } from './dto/data-input.dto';
dotenv.config();


@Injectable()
export class DatabaseService implements OnApplicationShutdown, OnModuleDestroy {
  //Create Client for ClickHouse
  private readonly clickhhouseClient = createClient({
    host: this.getFromEnv("HOST"),
    username:'default',
    password: this.getFromEnv("PASSWORD"),
    database:this.getFromEnv("DATABASE"),
  });

  //Insert data into the chat table
  async uploadChat( data: DataInputDto) {
    const { createdAt, prompt, response, latency, inputTokens, outputTokens, metadata, stream, engine, n, status_code } = data;
    try {
        const id = uuidv4();
        await this.clickhhouseClient.insert({
            table: "chat",
            values: [{
                id,
                user:metadata.user,
                env:metadata.env,
                status_code: status_code?200:500,
                createdAt:new Date(),
                input:prompt,
                output: response,
                latency: latency,
                inputTokens: inputTokens,
                outputTokens: outputTokens,
                stream: stream,
            }],
            format: 'JSONEachRow'
        });

        // Insert data into the metrics table
        await this.clickhhouseClient.insert({
          table: "metrics",
          values: [{
              id,
              user:metadata.user,
              status_code: status_code?200:500,
              env:metadata.env,
              createdAt: createdAt,
              model:metadata.model,
              temperature:metadata.temperature,
              max_tokens:metadata.max_tokens,
              top_p:metadata.top_p,
              frequency_penalty:metadata.frequency_penalty,
              presence_penalty:metadata.presence_penalty,
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
    } catch (error) {
        console.error('Error inserting data into chats table:', error);
        throw error;
    }
  }


  getFromEnv(key: string) {
    if (process.env[key]) {
      return process.env[key]
    }
    console.error(`${key} environment variable should be set`)
    process.exit(1)
  }

  //Handle Closing of the clickhouse client
  onApplicationShutdown(signal?: string) {
    console.log('Application is shutting down...');
    this.closeClickHouseClient();
  }
  async onModuleDestroy() {
    console.log('DatabaseService is being destroyed');
    await this.closeClickHouseClient();
  }
  private async closeClickHouseClient() {
    try {
      await this.clickhhouseClient.close();
      console.log('ClickHouse client closed successfully');
    } catch (error) {
      console.error('Error closing ClickHouse client:', error);
    }
  }
}