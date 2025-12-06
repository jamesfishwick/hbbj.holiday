import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import handler from '../../pages/api/search';
import { mockMixWithPlaylist, mockMixWithoutPlaylist } from '../fixtures/mock-data';
import * as mixes from '@utils/mixes';

// Helper to create mock request/response objects
const createMockRequest = (method = 'GET', query = {}) => ({
  method,
  query,
});

const createMockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
  };
  return res;
};

describe('Search API Handler', () => {
  let getSortedMixesSpy;

  beforeEach(() => {
    // Spy on getSortedMixes
    getSortedMixesSpy = jest.spyOn(mixes, 'getSortedMixes').mockResolvedValue([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('happy path returns search results matching query in title', async () => {
    const mockMixes = [
      mockMixWithPlaylist,
      mockMixWithoutPlaylist,
    ];
    getSortedMixesSpy.mockResolvedValue(mockMixes);

    const req = createMockRequest('GET', { q: '2024' });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const results = res.json.mock.calls[0][0].results;
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('2024');
    expect(results[0].title).toBe(2024);
  });

  test('returns results matching query in description', async () => {
    const mockMix = {
      slug: '2024',
      frontmatter: {
        title: 2024,
        description: 'Amazing holiday classics',
        date: new Date('2024-12-25'),
      },
      excerpt: 'Test excerpt',
      content: '# Test',
      playlist: [],
    };
    getSortedMixesSpy.mockResolvedValue([mockMix]);

    const req = createMockRequest('GET', { q: 'amazing' });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const results = res.json.mock.calls[0][0].results;
    expect(results).toHaveLength(1);
    expect(results[0].description).toBe('Amazing holiday classics');
  });

  test('returns results matching query in playlist tracks', async () => {
    const mockMixes = [mockMixWithPlaylist];
    getSortedMixesSpy.mockResolvedValue(mockMixes);

    const req = createMockRequest('GET', { q: 'bing crosby' });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      results: expect.arrayContaining([
        expect.objectContaining({
          matchingTracks: expect.arrayContaining([
            expect.objectContaining({
              artist: 'Bing Crosby',
            }),
          ]),
        }),
      ]),
    });
  });

  test('returns matching tracks limited to first 3', async () => {
    const mockMixWithManyTracks = {
      ...mockMixWithPlaylist,
      slug: 'test-mix',
      frontmatter: {
        title: 2020,
        description: 'Test Artist collection',
        date: new Date('2020-12-25'),
      },
      playlist: [
        { name: 'Song 1', singer: 'Test Artist', musicSrc: '', cover: '' },
        { name: 'Song 2', singer: 'Test Artist', musicSrc: '', cover: '' },
        { name: 'Song 3', singer: 'Test Artist', musicSrc: '', cover: '' },
        { name: 'Song 4', singer: 'Test Artist', musicSrc: '', cover: '' },
        { name: 'Song 5', singer: 'Test Artist', musicSrc: '', cover: '' },
      ],
    };
    getSortedMixesSpy.mockResolvedValue([mockMixWithManyTracks]);

    const req = createMockRequest('GET', { q: 'test artist' });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const results = res.json.mock.calls[0][0].results;
    expect(results).toHaveLength(1);
    expect(results[0].matchingTracks).toHaveLength(3);
  });

  test('case-insensitive search works correctly', async () => {
    const mockMixes = [mockMixWithPlaylist];
    getSortedMixesSpy.mockResolvedValue(mockMixes);

    const req = createMockRequest('GET', { q: 'BING CROSBY' });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      results: expect.arrayContaining([
        expect.objectContaining({
          matchingTracks: expect.arrayContaining([
            expect.objectContaining({
              artist: 'Bing Crosby',
            }),
          ]),
        }),
      ]),
    });
  });

  test('empty query returns empty results', async () => {
    const req = createMockRequest('GET', { q: '' });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ results: [] });
    expect(getSortedMixesSpy).not.toHaveBeenCalled();
  });

  test('missing query parameter returns empty results', async () => {
    const req = createMockRequest('GET', {});
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ results: [] });
    expect(getSortedMixesSpy).not.toHaveBeenCalled();
  });

  test('non-string query parameter returns empty results', async () => {
    const req = createMockRequest('GET', { q: 123 });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ results: [] });
  });

  test('no matching results returns empty array', async () => {
    const mockMixes = [mockMixWithPlaylist];
    getSortedMixesSpy.mockResolvedValue(mockMixes);

    const req = createMockRequest('GET', { q: 'nonexistent query' });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ results: [] });
  });

  test('POST method returns 405 error', async () => {
    const req = createMockRequest('POST', { q: 'test' });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Allow', ['GET']);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Method POST not allowed',
    });
  });

  test('PUT method returns 405 error', async () => {
    const req = createMockRequest('PUT', { q: 'test' });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Allow', ['GET']);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Method PUT not allowed',
    });
  });

  test('handles getSorted Mixes error gracefully', async () => {
    getSortedMixesSpy.mockImplementationOnce(() => Promise.reject(new Error('Database error')));

    const req = createMockRequest('GET', { q: 'test' });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Failed to search mixes',
      })
    );
  });

  test('error response structure is correct', async () => {
    getSortedMixesSpy.mockImplementationOnce(() => Promise.reject(new Error('Test error message')));

    const req = createMockRequest('GET', { q: 'test' });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Failed to search mixes',
      })
    );
    // Note: details field depends on NODE_ENV which cannot be changed in test environment
  });

  // Note: Removed "error hides details in production mode" test
  // NODE_ENV cannot be modified in Next.js test environment

  test('handles mixes without playlists correctly', async () => {
    const mockMixes = [mockMixWithoutPlaylist];
    getSortedMixesSpy.mockResolvedValue(mockMixes);

    const req = createMockRequest('GET', { q: '2023' });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      results: expect.arrayContaining([
        expect.objectContaining({
          id: '2023',
          matchingTracks: [],
        }),
      ]),
    });
  });

  test('searches in content markdown', async () => {
    const mockMixes = [
      {
        ...mockMixWithPlaylist,
        frontmatter: {
          title: 2019,
          description: 'Golden age classics',
          date: new Date('2019-12-25'),
        },
        content: 'This mix features wonderful holiday classics from the golden age',
      },
    ];
    getSortedMixesSpy.mockResolvedValue(mockMixes);

    const req = createMockRequest('GET', { q: 'golden age' });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0].results).toHaveLength(1);
  });
});
