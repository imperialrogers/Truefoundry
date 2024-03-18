import { Injectable, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';
import { createClient } from '@clickhouse/client'
import * as dotenv from 'dotenv';
import { FiltersDto } from './dto/filters.dto';
dotenv.config();


@Injectable()
export class DashboardService {
    /************************************************INITIALIZING CLICKHOUSE CLIENT*******************************************/ 
    private readonly clickhhouseClient = createClient({
        host: this.getFromEnv("HOST"),
        username:'default',
        password: this.getFromEnv("PASSWORD"),
        database:this.getFromEnv("DATABASE"),
    });

    getFromEnv(key: string) {
        if (process.env[key]) {
          return process.env[key]
        }
        console.error(`${key} environment variable should be set`)
        process.exit(1)
      }

    //Filtering The Logs
    async getRequestWithFilters(filters?: FiltersDto) {
        let query = 'SELECT * FROM metrics';
        // Update if any filters are provided
        if (filters) {
          const filterKeys = Object.keys(filters);
          if (filterKeys.length > 0) {
            query += ' WHERE ';
            filterKeys.forEach((key, index) => {
              switch (key) {
                case 'id':
                case 'user':
                case 'env':
                case 'status_code':
                case 'input':
                case 'output':
                case 'model':
                case 'engine':
                  query += `${key} = '${filters[key]}'`;
                  break;
                case 'createdAt':
                  query += `${key} BETWEEN '${filters[key].start}' AND '${filters[key].end}'`;
                  break;
                case 'temperature':
                case 'max_tokens':
                case 'inputTokens':
                case 'outputTokens':
                  query += `${key} >= ${filters[key].min} AND ${key} <= ${filters[key].max}`;
                  break;
                case 'top_p':
                case 'frequency_penalty':
                case 'presence_penalty':
                case 'metricslatency':
                  query += `${key} >= ${filters[key].min} AND ${key} <= ${filters[key].max}`;
                  break;
              }
              if (index < filterKeys.length - 1) {
                query += ' AND ';
              }
            });
          }
        }
        query += ' ORDER BY createdAt DESC';
      
        try {
          const result = await this.clickhhouseClient.query({
            query: query,
            format: 'JSONEachRow'
          });
          return await result.json();
        } catch (error) {
          throw error;
        }
      }
    
    
    /************************************************DASHBOARD TAB APIS*******************************************/
    async getAggregatedMetrics(): Promise<{
    totalEntries: number;
    totalUniqueUsers: number;
    averageMetricsLatency: number;
    averageCallsInLast30Days: number;
    totalSuccess: number;
    totalFailures: number;}> {
    const currentDate = new Date();
    const last30Days = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 30);
    const last30DaysISOString = last30Days.toISOString().slice(0, 19).replace('T', ' ');

    const query = `
        SELECT
            COUNT(*) AS total_entries,
            COUNT(DISTINCT user) AS total_unique_users,
            AVG(metricslatency) AS average_metrics_latency,
            (SELECT COUNT(*) / 30 FROM metrics WHERE createdAt >= toDateTime('${last30DaysISOString}')) AS average_calls_last_30_days,
            COUNTIf(status_code = 200) AS total_success,
            COUNTIf(status_code >= 300) AS total_failures
        FROM metrics
    `;
    try {
      const result = await this.clickhhouseClient.query({ query, format: 'JSONEachRow' });
      const metrics = (await result.json())[0];

      return {
            totalEntries: parseInt(metrics.total_entries),
            totalUniqueUsers: parseInt(metrics.total_unique_users),
            averageMetricsLatency: parseFloat(metrics.average_metrics_latency.toFixed(3)),
            averageCallsInLast30Days: parseFloat(metrics.average_calls_last_30_days.toFixed(3)),
            totalSuccess: parseInt(metrics.total_success),
            totalFailures: parseInt(metrics.total_failures),
        };
    } catch (error) {
        throw error;
    }
}

async getLatestLogEntry(): Promise<{
  total_revenue: number | 0;
  users: number | 0;
  calls: number | 0;
  latency: number | 0;
}> {
  const query = `
      SELECT
          total_revenue,
          users,
          calls,
          latency
      FROM logs
      ORDER BY createdAt DESC LIMIT 1
  `;

  try {
      const result = await this.clickhhouseClient.query({ query, format: 'JSONEachRow' });
      const latestEntry = (await result.json())[0];

      if (latestEntry) {
          return {
              total_revenue: parseFloat(latestEntry.total_revenue),
              users: parseInt(latestEntry.users),
              calls: parseInt(latestEntry.calls),
              latency: parseFloat(latestEntry.latency),
          };
      } else {
          return {
              total_revenue: null,
              users: null,
              calls: null,
              latency: null,
          };
      }
  } catch (error) {
      throw error;
  }
}


//Latest top 5 queries
async getLatestChatEntries(): Promise<any[]> {
    const query = `
      SELECT user, createdAt, input, output, status_code
      FROM chat
      ORDER BY createdAt DESC
      LIMIT 5
    `;
    try {
      const result = await this.clickhhouseClient.query({
        query: query,
        format: 'JSONEachRow'
      });
      return await result.json();
    } catch (error) {
      throw error;
    }
  }

  //Environment wise distribution
  async getEnvPercentage() {
    try {
      const query = `
        SELECT 
          env, 
          COUNT(*) AS count,
          ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM chat), 2) AS percentage
        FROM 
          chat 
        GROUP BY 
          env;
      `;
      const result = await this.clickhhouseClient.query({ query, format: 'JSONEachRow' });
      return await result.json();
    } catch (error) {
      throw new Error('Failed to fetch data');
    }
  }
  

  /************************************************CUSTOMER TAB APIS*******************************************/
  async getUsersData() {
    try {
      const query = `
        SELECT
          user,
          COUNT(*) AS request_count,
          SUM(inputTokens) AS total_input_tokens,
          SUM(outputTokens) AS total_output_tokens,
          env
        FROM metrics
        GROUP BY user, env;
      `;
  
      const result = await this.clickhhouseClient.query({ query, format: 'JSONEachRow' });
      return await result.json();
    } catch (error) {
      throw new Error('Failed to fetch data');
    }
  }



  /******************************************************CHARTS TAB APIS*******************************************/
  async getBarChartData(groupBy: 'month' | 'year' | 'hour' | 'day' | 'quarter') {
    try {
      let groupByClause;
      let orderByClause;
      let filterClause = '';
  
      switch (groupBy) {
        case 'month':
          groupByClause = 'toMonth(createdAt) AS group_key';
          orderByClause = 'group_key';
          filterClause = `WHERE toYear(createdAt) = toYear(now())`;
          break;
        case 'year':
          groupByClause = 'toYear(createdAt) AS group_key';
          orderByClause = 'group_key';
          break;
        case 'hour':
          groupByClause = 'toHour(createdAt) AS group_key';
          orderByClause = 'group_key';
          filterClause = `WHERE toDate(createdAt) = toDate(now())`;
          break;
        case 'day':
          groupByClause = 'toDayOfMonth(createdAt) AS group_key';
          orderByClause = 'group_key';
          filterClause = `WHERE toYear(createdAt) = toYear(now()) AND toMonth(createdAt) = toMonth(now())`;
          break;
        case 'quarter':
          groupByClause = 'toQuarter(createdAt) AS group_key';
          orderByClause = 'group_key';
          break;
        default:
          throw new Error('Invalid groupBy parameter');
      }
  
      const query = `
        SELECT
          ${groupByClause},
          SUM(inputTokens) AS total_input_tokens,
          SUM(outputTokens) AS total_output_tokens,
          SUM(IF(status_code = 200, 1, 0)) AS total_success_count,
          SUM(IF(status_code = 500, 1, 0)) AS total_failure_count
        FROM
          metrics
        ${filterClause}
        GROUP BY
          ${groupByClause}
        ORDER BY
          ${orderByClause};
      `;
  
      const result = await this.clickhhouseClient.query({ query, format: 'JSONEachRow' });
      return await result.json();
    } catch (error) {
      throw new Error('Failed to fetch data');
    }
  }
  // Model wise distribution
  async getTotalRequestsPerModel() {
    try {
      const query = `
        SELECT
          model,
          COUNT(*) AS total_requests
        FROM
          metrics
        GROUP BY
          model;
      `;
  
      const result = await this.clickhhouseClient.query({ query, format: 'JSONEachRow' });
      return await result.json();
    } catch (error) {
      throw new Error('Failed to fetch data');
    }
  }

    /************************************************PERCENTAGE TAB API*******************************************/ 
  async getPercentages(timeRange: 'month' | 'quarter' | 'year' ) {
    try {
      let groupByClause = '';
      let timeClause = '';
  
      switch (timeRange) { 
        case 'month':
          groupByClause = 'toMonth(createdAt) AS timeRange';
          timeClause = "toYear(createdAt) = toYear(now())";
          break;
        case 'quarter':
          groupByClause = 'toQuarter(createdAt) AS timeRange';
          timeClause = "toYear(createdAt) = toYear(now())";
          break;
        case 'year':
          groupByClause = 'toYear(createdAt) AS timeRange';
          timeClause = '1';
          break;
        default:
          throw new Error('Invalid time range');
      }
  
      const query = `
        SELECT
          ${groupByClause},
          round(sum(if(status_code = 200, 1, 0)) * 100.0 / count(*), 2) AS success_percentage,
          round(sum(if(env = 'production', 1, 0)) * 100.0 / count(*), 2) AS prod_env_percentage,
          round(sum(if(env = 'development', 1, 0)) * 100.0 / count(*), 2) AS dev_env_percentage,
          round(sum(if(env = 'development', 1, 0)) * 100.0 / count(*), 2) AS test_env_percentage,
          round(sum(if(env = 'others', 1, 0)) * 100.0 / count(*), 2) AS oth_env_percentage,
          ROUND(SUM(IF(model = 'gpt-3.5-turbo', 1, 0)) * 100.0 / COUNT(*), 2) AS gpt_3_5_turbo_percentage,
          ROUND(SUM(IF(model = 'gpt-3.5-turbo-1106', 1, 0)) * 100.0 / COUNT(*), 2) AS gpt_3_5_turbo_1106_percentage,
          ROUND(SUM(IF(model = 'gpt-3.5-turbo-0613', 1, 0)) * 100.0 / COUNT(*), 2) AS gpt_3_5_turbo_0613_percentage,
          ROUND(SUM(IF(model = 'gpt-3.5-turbo-0301', 1, 0)) * 100.0 / COUNT(*), 2) AS gpt_3_5_turbo_0301_percentage,
          ROUND(SUM(IF(model = 'gpt-3.5-turbo-0125', 1, 0)) * 100.0 / COUNT(*), 2) AS gpt_3_5_turbo_0125_percentage,
          ROUND(SUM(IF(model = 'gpt-3.5-turbo-16k', 1, 0)) * 100.0 / COUNT(*), 2) AS gpt_3_5_turbo_16k_percentage,
          ROUND(SUM(IF(model = 'gpt-3.5-turbo-16k-0613', 1, 0)) * 100.0 / COUNT(*), 2) AS gpt_3_5_turbo_16k_0613_percentage,
          round(sum(if(engine = 'openai', 1, 0)) * 100.0 / count(*), 2) AS openai_engine_percentage
        FROM
          metrics
        WHERE
          ${timeClause}
        GROUP BY
          timeRange
        ORDER BY
          timeRange;
      `;
  
      const result = await this.clickhhouseClient.query({ query, format: 'JSONEachRow' });
      const data = await result.json();
  
      return data;
    } catch (error) {
      throw new Error('Failed to fetch data');
    }
  }

  /************************************************LINE CHART API*******************************************/ 
  async getLineData(groupBy: 'month' | 'year' | 'hour' | 'day' | 'quarter') {
    try {
      let groupByClause;
      let orderByClause;
      let filterClause = '';
  
      switch (groupBy) {
        case 'month':
          groupByClause = 'toMonth(createdAt) AS group_key';
          orderByClause = 'group_key';
          filterClause = `WHERE toYear(createdAt) = toYear(now())`;
          break;
        case 'year':
          groupByClause = 'toYear(createdAt) AS group_key';
          orderByClause = 'group_key';
          break;
        case 'hour':
          groupByClause = 'toHour(createdAt) AS group_key';
          orderByClause = 'group_key';
          filterClause = `WHERE toDate(createdAt) = toDate(now())`;
          break;
        case 'day':
          groupByClause = 'toDayOfMonth(createdAt) AS group_key';
          orderByClause = 'group_key';
          filterClause = `WHERE toYear(createdAt) = toYear(now()) AND toMonth(createdAt) = toMonth(now())`;
          break;
        case 'quarter':
          groupByClause = 'toQuarter(createdAt) AS group_key';
          orderByClause = 'group_key';
          break;
        default:
          throw new Error('Invalid groupBy parameter');
      }
  
      const query = `
        SELECT 
          ${groupByClause},
          COUNT(*) AS api_requests,
          COUNT(DISTINCT user) AS total_active_users
        FROM 
          metrics 
        ${filterClause}
        GROUP BY 
          ${groupByClause} 
        ORDER BY 
          ${orderByClause};
      `;
  
      const result = await this.clickhhouseClient.query({ query, format: 'JSONEachRow' });
      return await result.json();
    } catch (error) {
      throw new Error('Failed to fetch data');
    }
  }  

  //MODEL WISE LINE CHART DATA
  async getModelWiseDistribution(groupBy: 'month' | 'year' | 'hour' | 'day' | 'quarter', model: string) {
    try {
      let groupByClause;
      let orderByClause;
      let filterClause = '';
  
      switch (groupBy) {
        case 'hour':
          groupByClause = 'toHour(createdAt) AS hour';
          orderByClause = 'group_key';
          filterClause = `WHERE model = '${model}' AND toStartOfDay(createdAt) = toStartOfDay(now())`;
          break;
        case 'day':
          groupByClause = 'toDate(createdAt) as day';
          orderByClause = 'group_key';
          filterClause = `WHERE model = '${model}' AND toMonth(createdAt) = toMonth(now())`;
          break;
        case 'quarter':
          groupByClause = 'toQuarter(createdAt) AS quarter';
          orderByClause = 'group_key';
          filterClause= `WHERE model = '${model}' AND toYear(createdAt) = toYear(now())`;
          break;
        case 'month':
          groupByClause = `toMonth(createdAt) as month`;
          orderByClause = 'group_key';
          filterClause = `WHERE model='${model}' AND toYear(createdAt) = toYear(now())`;
          break;
        case 'year':
          groupByClause = `toYear(createdAt) AS year`;
          orderByClause = 'group_key';
          filterClause= `WHERE model='${model}'`;
          break;
        default:
          throw new Error('Invalid groupBy parameter');
      }
  
      const query = `
      SELECT 
        ${groupByClause},
        COUNT(*) as total_requests,
        AVG(metricslatency) as average_latency
      FROM
        metrics 
      ${filterClause}
      GROUP BY 
        ${groupBy}
      ORDER BY 
        ${groupBy}
    `; 
      const result = await this.clickhhouseClient.query({ query, format: 'JSONEachRow' });
      const logs=await result.json();
      return logs;
    } catch (error) {
      throw new Error('Failed to fetch data');
    }
  }
}      