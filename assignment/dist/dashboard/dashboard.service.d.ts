import { FiltersDto } from './dto/filters.dto';
export declare class DashboardService {
    private readonly clickhhouseClient;
    getFromEnv(key: string): string;
    getRequestWithFilters(filters?: FiltersDto): Promise<unknown>;
    getAggregatedMetrics(): Promise<{
        totalEntries: number;
        totalUniqueUsers: number;
        averageMetricsLatency: number;
        averageCallsInLast30Days: number;
        totalSuccess: number;
        totalFailures: number;
    }>;
    getLatestLogEntry(): Promise<{
        total_revenue: number | 0;
        users: number | 0;
        calls: number | 0;
        latency: number | 0;
    }>;
    getLatestChatEntries(): Promise<any[]>;
    getEnvPercentage(): Promise<unknown>;
    getUsersData(): Promise<unknown>;
    getBarChartData(groupBy: 'month' | 'year' | 'hour' | 'day' | 'quarter'): Promise<unknown>;
    getTotalRequestsPerModel(): Promise<unknown>;
    getPercentages(timeRange: 'month' | 'quarter' | 'year'): Promise<unknown>;
    getLineData(groupBy: 'month' | 'year' | 'hour' | 'day' | 'quarter'): Promise<unknown>;
    getModelWiseDistribution(groupBy: 'month' | 'year' | 'hour' | 'day' | 'quarter', model: string): Promise<unknown>;
}
