import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('IngestionService', () => {
  let service: IngestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngestionService],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should trigger an ingestion process and return ingestionId', async () => {
    const webhookUrl = 'https://example.com/webhook';

    const result = await service.triggerIngestion('test-source', webhookUrl);

    expect(result).toHaveProperty('ingestionId');
    expect(result).toHaveProperty('status', 'IN_PROGRESS');

   
    const status = service.getIngestionStatus(result.ingestionId);
    expect(status.status).toBe('IN_PROGRESS');

    expect(mockedAxios.post).toHaveBeenCalledWith(webhookUrl, {
      ingestionId: result.ingestionId,
      status: 'IN_PROGRESS',
    });
  });

  it('should return NOT_FOUND for an unknown ingestion ID', () => {
    const status = service.getIngestionStatus('invalid-id');
    expect(status.status).toBe('NOT_FOUND');
  });

  it('should handle webhook errors gracefully', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Webhook failed'));

    const webhookUrl = 'https://example.com/webhook';
    const result = await service.triggerIngestion('test-source', webhookUrl);

    expect(result).toHaveProperty('ingestionId');
    expect(mockedAxios.post).toHaveBeenCalledWith(webhookUrl, {
      ingestionId: result.ingestionId,
      status: 'IN_PROGRESS',
    });

  });
});
