import { DatabaseService } from './database.service';
import { DataInputDto } from './dto/data-input.dto';
export declare class DatabaseController {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(data: DataInputDto): Promise<string>;
}
