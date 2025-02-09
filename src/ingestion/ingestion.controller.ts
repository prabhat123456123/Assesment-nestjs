import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  async triggerIngestion(@Body() data: { source: string; webhookUrl?: string }) {
    return this.ingestionService.triggerIngestion(data.source, data.webhookUrl);
  }

  @Get('status/:id')
  getIngestionStatus(@Param('id') ingestionId: string) {
    return this.ingestionService.getIngestionStatus(ingestionId);
  }
}
