import { OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';
import { DataInputDto } from './dto/data-input.dto';
export declare class DatabaseService implements OnApplicationShutdown, OnModuleDestroy {
    private readonly clickhhouseClient;
    uploadChat(data: DataInputDto): Promise<string>;
    getFromEnv(key: string): string;
    onApplicationShutdown(signal?: string): void;
    onModuleDestroy(): Promise<void>;
    private closeClickHouseClient;
}
