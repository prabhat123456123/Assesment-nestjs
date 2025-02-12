import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import axios from 'axios';

jest.mock('axios'); // Mock axios to prevent actual API calls

describe('IngestionService', () => {
  let ingestionService: IngestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngestionService],
    }).compile();

    ingestionService = module.get<IngestionService>(IngestionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger ingestion and return ingestion ID', async () => {
    const result = await ingestionService.triggerIngestion('test-source');
    expect(result).toHaveProperty('ingestionId');
    expect(result).toHaveProperty('status', 'IN_PROGRESS');
  });

  jest.useFakeTimers();

it('should update the ingestion status after completion', async () => {
  const source = 'test-source';
  const { ingestionId } = await ingestionService.triggerIngestion(source);

  // Initially, the status should be IN_PROGRESS
  expect(ingestionService.getIngestionStatus(ingestionId)).toEqual({
    status: 'IN_PROGRESS',
    webhookUrl: undefined,
  });

  // Fast-forward time to simulate ingestion completion
  jest.advanceTimersByTime(5000);

  // Now the status should be COMPLETED
  expect(ingestionService.getIngestionStatus(ingestionId)).toEqual({
    status: 'COMPLETED',
    webhookUrl: undefined,
  });
});

  

  it('should send a webhook on ingestion start and completion', async () => {
    jest.useFakeTimers();
    const webhookUrl = 'https://webhook.test.com';

    const { ingestionId } = await ingestionService.triggerIngestion('test-source', webhookUrl);

    // Webhook should be sent when ingestion starts
    expect(axios.post).toHaveBeenCalledWith(webhookUrl, {
      ingestionId,
      status: 'IN_PROGRESS',
    });

    // Simulate time passing for completion
    jest.advanceTimersByTime(5000);

    // Webhook should be sent when ingestion completes
    expect(axios.post).toHaveBeenCalledWith(webhookUrl, {
      ingestionId,
      status: 'COMPLETED',
    });

    jest.useRealTimers();
  });

  it('should return NOT_FOUND status for an invalid ingestion ID', () => {
    expect(ingestionService.getIngestionStatus('invalid-id')).toEqual({ status: 'NOT_FOUND' });
  });

  it('should handle webhook failures gracefully', async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Webhook failed'));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await ingestionService['sendWebhook']('https://webhook.test.com', { test: 'data' });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to send webhook:', 'Webhook failed');

    consoleErrorSpy.mockRestore();
  });
});
