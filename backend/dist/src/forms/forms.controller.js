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
exports.FormsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const forms_service_1 = require("./forms.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let FormsController = class FormsController {
    constructor(formsService) {
        this.formsService = formsService;
    }
    getTemplates() {
        return this.formsService.getTemplates();
    }
    getTemplate(id) {
        return this.formsService.getTemplate(id);
    }
    submitForm(req, body) {
        return this.formsService.submitForm({
            ...body,
            submittedById: req.user.id,
            departmentId: body.departmentId || req.user.departmentId,
        });
    }
    getSubmissions(query) {
        return this.formsService.getSubmissions(query);
    }
    getSubmission(id) {
        return this.formsService.getSubmission(id);
    }
    updateSubmission(id, body) {
        return this.formsService.updateSubmission(id, body);
    }
    getSubmissionStatus(date) {
        return this.formsService.getDepartmentSubmissionStatus(date || new Date().toISOString());
    }
};
exports.FormsController = FormsController;
__decorate([
    (0, common_1.Get)('templates'),
    (0, swagger_1.ApiOperation)({ summary: 'List active form templates' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Get)('templates/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get form template by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Post)('submissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a form' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "submitForm", null);
__decorate([
    (0, common_1.Get)('submissions'),
    (0, swagger_1.ApiOperation)({ summary: 'List form submissions with filters' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "getSubmissions", null);
__decorate([
    (0, common_1.Get)('submissions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get single submission' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "getSubmission", null);
__decorate([
    (0, common_1.Put)('submissions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a submission' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "updateSubmission", null);
__decorate([
    (0, common_1.Get)('submission-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Check department submission status for a date' }),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "getSubmissionStatus", null);
exports.FormsController = FormsController = __decorate([
    (0, swagger_1.ApiTags)('Forms'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('forms'),
    __metadata("design:paramtypes", [forms_service_1.FormsService])
], FormsController);
//# sourceMappingURL=forms.controller.js.map