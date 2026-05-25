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
exports.GraphsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const graphs_service_1 = require("./graphs.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let GraphsController = class GraphsController {
    constructor(graphsService) {
        this.graphsService = graphsService;
    }
    getTemperatureTrend(query) {
        return this.graphsService.getTemperatureTrend(query);
    }
    getDashboard(req, departmentId) {
        return this.graphsService.getDashboardSummary(departmentId || req.user.departmentId);
    }
    getLocations(departmentId) {
        return this.graphsService.getLocations(departmentId);
    }
};
exports.GraphsController = GraphsController;
__decorate([
    (0, common_1.Get)('temperature-trend'),
    (0, swagger_1.ApiOperation)({ summary: 'Get temperature trend data for charts' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GraphsController.prototype, "getTemperatureTrend", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard summary data' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('departmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GraphsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('locations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available recording locations' }),
    __param(0, (0, common_1.Query)('departmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GraphsController.prototype, "getLocations", null);
exports.GraphsController = GraphsController = __decorate([
    (0, swagger_1.ApiTags)('Graphs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('graphs'),
    __metadata("design:paramtypes", [graphs_service_1.GraphsService])
], GraphsController);
//# sourceMappingURL=graphs.controller.js.map