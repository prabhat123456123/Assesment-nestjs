import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class IngestionService {
  private ongoingIngestions = new Map<string, { status: string; webhookUrl?: string }>();

  async triggerIngestion(source: string, webhookUrl?: string) {
    const ingestionId = `ingestion-${Date.now()}`;
    this.ongoingIngestions.set(ingestionId, { status: 'IN_PROGRESS', webhookUrl });

    // Send webhook notification: Ingestion Started
    if (webhookUrl) {
      this.sendWebhook(webhookUrl, { ingestionId, status: 'IN_PROGRESS' });
    }

    // Simulate ingestion process (Replace with actual ingestion logic)
    setTimeout(() => {
      this.ongoingIngestions.set(ingestionId, { status: 'COMPLETED', webhookUrl });

      // Send webhook notification: Ingestion Completed
      if (webhookUrl) {
        this.sendWebhook(webhookUrl, { ingestionId, status: 'COMPLETED' });
      }
    }, 5000);

    return { ingestionId, status: 'IN_PROGRESS' };
  }

  getIngestionStatus(ingestionId: string) {
    return this.ongoingIngestions.get(ingestionId) || { status: 'NOT_FOUND' };
  }

  private async sendWebhook(url: string, payload: any) {
    try {
      return await axios.post(url, payload);
    } catch (error) {
      console.error('Failed to send webhook:', error.message);
    }
  }
}
