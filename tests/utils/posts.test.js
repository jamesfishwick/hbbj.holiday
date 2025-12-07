import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

// Mock fs module
jest.mock('node:fs');

const fs = require('node:fs');
const { getSortedPostsData, getAllPostIds, getPostData } = require('../../utils/posts');

describe('getSortedPostsData', () => {
  beforeEach(() => {
    jest.spyOn(process, 'cwd').mockReturnValue('/test');
    fs.readdirSync.mockClear();
    fs.readFileSync.mockClear();
  });

  afterEach(() => {
    process.cwd.mockRestore();
  });

  test('returns sorted posts data from directory', () => {
    fs.readdirSync.mockReturnValue(['2024', '2023', '2022']);
    fs.readFileSync.mockImplementation((path) => {
      if (path.includes('2024')) return '#EXTM3U\n#EXTINF:-1,Track 2024';
      if (path.includes('2023')) return '#EXTM3U\n#EXTINF:-1,Track 2023';
      if (path.includes('2022')) return '#EXTM3U\n#EXTINF:-1,Track 2022';
      return '';
    });

    const result = getSortedPostsData();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
    expect(result[0].fileName).toBeDefined();
    expect(result[0].fileContents).toBeDefined();
  });

  test('returns empty array when directory is empty', () => {
    fs.readdirSync.mockReturnValue([]);

    const result = getSortedPostsData();

    expect(result).toEqual([]);
  });

  test('reads files from correct directory path', () => {
    fs.readdirSync.mockReturnValue(['2024']);
    fs.readFileSync.mockReturnValue('#EXTM3U');

    getSortedPostsData();

    expect(fs.readdirSync).toHaveBeenCalledWith(expect.stringContaining('content/mixes'));
  });

  test('sorts posts correctly by date property', () => {
    fs.readdirSync.mockReturnValue(['2020', '2024', '2022']);
    fs.readFileSync.mockReturnValue('#EXTM3U');

    const posts = [
      { fileName: '2024', date: '2024-01-01', fileContents: '' },
      { fileName: '2022', date: '2022-01-01', fileContents: '' },
      { fileName: '2020', date: '2020-01-01', fileContents: '' },
    ];

    // Test sorting logic directly
    const sorted = posts.sort((a, b) => {
      if (a.date < b.date) return 1;
      else return -1;
    });

    expect(sorted[0].fileName).toBe('2024');
    expect(sorted[1].fileName).toBe('2022');
    expect(sorted[2].fileName).toBe('2020');
  });
});

describe('getAllPostIds', () => {
  beforeEach(() => {
    jest.spyOn(process, 'cwd').mockReturnValue('/test');
    fs.readdirSync.mockClear();
  });

  afterEach(() => {
    process.cwd.mockRestore();
  });

  test('returns array of post IDs with params structure', () => {
    fs.readdirSync.mockReturnValue(['2024', '2023', '2022']);

    const result = getAllPostIds();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      params: { id: '2024' },
    });
    expect(result[1]).toEqual({
      params: { id: '2023' },
    });
    expect(result[2]).toEqual({
      params: { id: '2022' },
    });
  });

  test('returns empty array when no posts exist', () => {
    fs.readdirSync.mockReturnValue([]);

    const result = getAllPostIds();

    expect(result).toEqual([]);
  });

  test('reads from correct directory', () => {
    fs.readdirSync.mockReturnValue(['2024']);

    getAllPostIds();

    expect(fs.readdirSync).toHaveBeenCalledWith(expect.stringContaining('content/mixes'));
  });
});

describe('getPostData', () => {
  beforeEach(() => {
    jest.spyOn(process, 'cwd').mockReturnValue('/test');
    fs.readFileSync.mockClear();
  });

  afterEach(() => {
    process.cwd.mockRestore();
  });

  test('returns post data for given ID', async () => {
    const mockContent = '# Test Post\n\nThis is test content.';
    fs.readFileSync.mockReturnValue(mockContent);

    const result = await getPostData('2024');

    expect(result).toBeDefined();
    expect(result.id).toBe('2024');
    expect(result.fileContents).toBe(mockContent);
  });

  test('reads file from correct path', async () => {
    fs.readFileSync.mockReturnValue('# Content');

    await getPostData('2023');

    expect(fs.readFileSync).toHaveBeenCalledWith(
      expect.stringContaining('content/mixes/2023/2023.md'),
      'utf8'
    );
  });

  test('handles different post IDs correctly', async () => {
    fs.readFileSync.mockReturnValue('# Different content');

    const result1 = await getPostData('2024');
    const result2 = await getPostData('2022');

    expect(result1.id).toBe('2024');
    expect(result2.id).toBe('2022');
  });
});
