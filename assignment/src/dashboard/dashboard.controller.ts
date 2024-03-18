import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query } from '@nestjs/common';
import { FiltersDto } from './dto/filters.dto';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
constructor(private readonly dashboard: DashboardService) {}

//Get Requests

@Get('latest-logs')
  getTopLogEntries(){
    return this.dashboard.getLatestLogEntry();
}

@Get('top-metrics')
getAggregatedMetrics(){
    return this.dashboard.getAggregatedMetrics();
}

@Get('latest5')
getTopFive(){
    return this.dashboard.getLatestChatEntries();
}

@Get('env') 
getEnvDis(){
    return this.dashboard.getEnvPercentage();
}

@Get('users')
getUserData(){
    return this.dashboard.getUsersData();
}


@Get('bar-chart')
getBarChartData(@Query('groupBy') groupBy: 'month' | 'year' | 'hour' | 'day' | 'quarter' = 'month') {
  return this.dashboard.getBarChartData(groupBy);
}

@Get('gpt-models')
getGPTModelsData(){
  return this.dashboard.getTotalRequestsPerModel();
}

@Get('percentages')
  getPercentages(@Query('timeRange') timeRange: 'month' | 'year' | 'quarter' = 'month') {
    return this.dashboard.getPercentages(timeRange);
  }

  @Get('line-data')
  getLineData(@Query('timeRange') timeRange: 'month' | 'year' | 'hour' | 'day' | 'quarter' = 'month') {
    return this.dashboard.getLineData(timeRange);
  }

  @Get('model-dist')
  getModelDist(@Query('timeRange') timeRange: 'month' | 'year' | 'hour' | 'day' | 'quarter' = 'month', @Query('model') model: string) {
    return this.dashboard.getModelWiseDistribution(timeRange, model);
  }


  //Post Requests
  @Post()
  getRequestWithFilters(@Query(ValidationPipe) filters: FiltersDto) {
    return this.dashboard.getRequestWithFilters(filters);
  }
}
