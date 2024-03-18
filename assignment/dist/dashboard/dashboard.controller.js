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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("./dashboard.service");
let DashboardController = class DashboardController {
    constructor(dashboard) {
        this.dashboard = dashboard;
    }
    getTopLogEntries() {
        return this.dashboard.getLatestLogEntry();
    }
    getAggregatedMetrics() {
        return this.dashboard.getAggregatedMetrics();
    }
    getTopFive() {
        return this.dashboard.getLatestChatEntries();
    }
    getEnvDis() {
        return this.dashboard.getEnvPercentage();
    }
    getUserData() {
        return this.dashboard.getUsersData();
    }
    getBarChartData(groupBy = 'month') {
        return this.dashboard.getBarChartData(groupBy);
    }
    getGPTModelsData() {
        return this.dashboard.getTotalRequestsPerModel();
    }
    getPercentages(timeRange = 'month') {
        return this.dashboard.getPercentages(timeRange);
    }
    getLineData(timeRange = 'month') {
        return this.dashboard.getLineData(timeRange);
    }
    getModelDist(timeRange = 'month', model) {
        return this.dashboard.getModelWiseDistribution(timeRange, model);
    }
    getRequestWithFilters(filters) {
        return this.dashboard.getRequestWithFilters(filters);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('latest-logs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getTopLogEntries", null);
__decorate([
    (0, common_1.Get)('top-metrics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getAggregatedMetrics", null);
__decorate([
    (0, common_1.Get)('latest5'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getTopFive", null);
__decorate([
    (0, common_1.Get)('env'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getEnvDis", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getUserData", null);
__decorate([
    (0, common_1.Get)('bar-chart'),
    __param(0, (0, common_1.Query)('groupBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getBarChartData", null);
__decorate([
    (0, common_1.Get)('gpt-models'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getGPTModelsData", null);
__decorate([
    (0, common_1.Get)('percentages'),
    __param(0, (0, common_1.Query)('timeRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getPercentages", null);
__decorate([
    (0, common_1.Get)('line-data'),
    __param(0, (0, common_1.Query)('timeRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getLineData", null);
__decorate([
    (0, common_1.Get)('model-dist'),
    __param(0, (0, common_1.Query)('timeRange')),
    __param(1, (0, common_1.Query)('model')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getModelDist", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getRequestWithFilters", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map