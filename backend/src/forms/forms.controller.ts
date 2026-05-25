import { Controller, Get, Post, Put, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FormsService } from './forms.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Forms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('forms')
export class FormsController {
  constructor(private formsService: FormsService) {}

  @Get('templates')
  @ApiOperation({ summary: 'List active form templates' })
  getTemplates() {
    return this.formsService.getTemplates();
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get form template by ID' })
  getTemplate(@Param('id') id: string) {
    return this.formsService.getTemplate(id);
  }

  @Post('submissions')
  @ApiOperation({ summary: 'Submit a form' })
  submitForm(@Request() req: any, @Body() body: any) {
    return this.formsService.submitForm({
      ...body,
      submittedById: req.user.id,
      departmentId: body.departmentId || req.user.departmentId,
    });
  }

  @Get('submissions')
  @ApiOperation({ summary: 'List form submissions with filters' })
  getSubmissions(@Query() query: any) {
    return this.formsService.getSubmissions(query);
  }

  @Get('submissions/:id')
  @ApiOperation({ summary: 'Get single submission' })
  getSubmission(@Param('id') id: string) {
    return this.formsService.getSubmission(id);
  }

  @Put('submissions/:id')
  @ApiOperation({ summary: 'Update a submission' })
  updateSubmission(@Param('id') id: string, @Body() body: any) {
    return this.formsService.updateSubmission(id, body);
  }

  @Get('submission-status')
  @ApiOperation({ summary: 'Check department submission status for a date' })
  getSubmissionStatus(@Query('date') date: string) {
    return this.formsService.getDepartmentSubmissionStatus(date || new Date().toISOString());
  }
}
