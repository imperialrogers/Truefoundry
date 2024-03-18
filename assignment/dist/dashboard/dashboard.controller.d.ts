import { FiltersDto } from './dto/filters.dto';
import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboard;
    constructor(dashboard: DashboardService);
    getTopLogEntries(): Promise<{
        total_revenue: number;
        users: number;
        calls: number;
        latency: number;
    }>;
    getAggregatedMetrics(): Promise<{
        totalEntries: number;
        totalUniqueUsers: number;
        averageMetricsLatency: number;
        averageCallsInLast30Days: number;
        totalSuccess: number;
        totalFailures: number;
    }>;
    getTopFive(): Promise<any[]>;
    getEnvDis(): Promise<unknown>;
    getUserData(): Promise<unknown>;
    getBarChartData(groupBy?: 'month' | 'year' | 'hour' | 'day' | 'quarter'): Promise<unknown>;
    getGPTModelsData(): Promise<unknown>;
    getPercentages(timeRange?: 'month' | 'year' | 'quarter'): Promise<unknown>;
    getLineData(timeRange?: 'month' | 'year' | 'hour' | 'day' | 'quarter'): Promise<unknown>;
    getModelDist(timeRange: 'month' | 'year' | 'hour' | 'day' | 'quarter', model: string): Promise<unknown>;
    getRequestWithFilters(filters: FiltersDto): Promise<unknown>;
}
