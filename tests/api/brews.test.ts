import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock PrismaClient so routes can be tested without a database
vi.mock('@prisma/client', () => {
  const createMock = vi.fn();
  const findManyMock = vi.fn();
  return {
    PrismaClient: vi.fn().mockImplementation(() => ({
      brew: {
        create: createMock,
        findMany: findManyMock,
      },
    })),
    __mocks: { createMock, findManyMock },
  };
});

// Access mocks provided by the factory
import * as prismaModule from '@prisma/client';
const { createMock, findManyMock } = (prismaModule as any).__mocks;

import { POST, GET } from '../../src/app/api/brews/route';
import { GET as GET_SUGGESTIONS } from '../../src/app/api/brews/suggestions/route';

function mockRequest(body: any) {
  return { json: async () => body } as any;
}

const sampleBrew = {
  date: '2024-01-01',
  coffee: 'Coffee',
  roaster: 'Roaster',
  origin: 'Origin',
  process: 'Process',
  grind: 'Medium',
  grinder: 'Grinder',
  dripper: 'V60',
  filter: 'paper',
  waterType: 'tap',
  waterTemp: '92',
  dose: '20',
  waterWeight: '300',
  brewTime: '2:30',
  bloom: '30',
  pours: '2',
  agitation: 'swirl',
  flavorHot: 'tasty',
  acidity: 'medium',
  sweetness: 'medium',
  body: 'full',
  bitterness: 'low',
  flavorCool: 'sweet',
  balance: 'good',
  score: '9',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/brews validation', () => {
  it('returns 400 with message when required fields are missing', async () => {
    const req = mockRequest({});
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain('Missing field');
    expect(data.error).toContain('date');
  });
});

describe('POST /api/brews success', () => {
  it('creates a brew and returns it', async () => {
    createMock.mockResolvedValue(sampleBrew);
    const req = mockRequest(sampleBrew);
    const res = await POST(req);
    const data = await res.json();
    expect(createMock).toHaveBeenCalledWith({ data: sampleBrew });
    expect(res.status).toBe(200);
    expect(data).toEqual(sampleBrew);
  });

  it('returns 500 when the database errors', async () => {
    createMock.mockRejectedValue(new Error('db fail'));
    const req = mockRequest(sampleBrew);
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toBe('db fail');
  });
});

describe('GET /api/brews', () => {
  it('returns a list of brews', async () => {
    findManyMock.mockResolvedValue([sampleBrew]);
    const res = await GET();
    const data = await res.json();
    expect(findManyMock).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(data).toEqual([sampleBrew]);
  });

  it('propagates errors from the database', async () => {
    findManyMock.mockRejectedValue(new Error('find error'));
    await expect(GET()).rejects.toThrow('find error');
  });
});

describe('GET /api/brews/suggestions', () => {
  it('returns suggestion lists for each field', async () => {
    findManyMock.mockImplementation(async (args: any) => {
      const field = Object.keys(args.select)[0];
      return [{ [field]: `${field}-val` }, { [field]: '' }, { [field]: null }];
    });
    const res = await GET_SUGGESTIONS();
    const data = await res.json();
    expect(findManyMock).toHaveBeenCalled();
    expect(data.coffee).toEqual(['coffee-val']);
    expect(Object.keys(data)).toContain('roaster');
  });

  it('throws when the database request fails', async () => {
    findManyMock.mockRejectedValue(new Error('suggest error'));
    await expect(GET_SUGGESTIONS()).rejects.toThrow('suggest error');
  });
});
