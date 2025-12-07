import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { mockM3U8Content, mockMarkdownContent } from '../fixtures/mock-data';

// Create mock functions that will be shared
const mockReaddirSync = jest.fn();
const mockReadFileSync = jest.fn();
const mockExistsSync = jest.fn();
const mockMatter = jest.fn();
const mockParserPush = jest.fn();
const mockParserEnd = jest.fn();
let mockParserManifest = { segments: [] };

// Mock modules
jest.mock('fs');
jest.mock('gray-matter');
jest.mock('m3u8-parser');

// Import mocked modules
const fs = require('node:fs');
const matter = require('gray-matter');
const { Parser } = require('m3u8-parser');

// Setup mocks
fs.readdirSync = mockReaddirSync;
fs.readFileSync = mockReadFileSync;
fs.existsSync = mockExistsSync;
matter.mockImplementation(mockMatter);
Parser.mockImplementation(() => ({
  push: mockParserPush,
  end: mockParserEnd,
  get manifest() {
    return mockParserManifest;
  },
}));

// Import tested functions after mocks are configured
const {
  getMixesFolders,
  getSortedMixes,
  getPostsSlugs,
  getPostBySlug,
  clearCache,
} = require('../../utils/mixes');

describe('getMixesFolders', () => {
  beforeEach(() => {
    mockReaddirSync.mockClear();
    mockReadFileSync.mockClear();
    mockExistsSync.mockClear();
  });

  test('happy path returns array of mix folder objects', () => {
    mockReaddirSync.mockReturnValue(['2024', '2023', '2022']);

    const result = getMixesFolders();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      directory: '2024',
      filename: '2024.md',
      playlist: '2024.m3u8',
    });
    expect(mockReaddirSync).toHaveBeenCalledWith(expect.stringContaining('content/mixes'));
  });

  test('returns empty array when no folders found', () => {
    mockReaddirSync.mockReturnValue([]);

    const result = getMixesFolders();

    expect(result).toEqual([]);
  });
});

describe('getSortedMixes', () => {
  beforeEach(() => {
    clearCache(); // Clear the cached mixes between tests
    mockReaddirSync.mockClear();
    mockReadFileSync.mockClear();
    mockExistsSync.mockClear();
    mockMatter.mockClear();
    mockParserPush.mockClear();
    mockParserEnd.mockClear();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    // Mock process.cwd() to return a consistent path
    jest.spyOn(process, 'cwd').mockReturnValue('/test');
  });

  afterEach(() => {
    console.error.mockRestore();
    process.cwd.mockRestore();
  });

  test('happy path parses M3U8 and returns formatted mixes', async () => {
    mockReaddirSync.mockReturnValue(['2024']);
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockImplementation((path) => {
      if (path.includes('.md')) {
        return Buffer.from(mockMarkdownContent);
      }
      if (path.includes('.m3u8')) {
        return mockM3U8Content;
      }
      return '';
    });

    mockMatter.mockReturnValue({
      data: {
        title: 2024,
        description: 'Holiday music mix for 2024',
        date: new Date('2024-12-25'),
      },
      excerpt: 'A collection of classic holiday songs',
      content: '# HBBJ 2024\n\nWelcome to the 2024 holiday mix!',
    });

    mockParserManifest = {
      segments: [
        { title: 'Bing Crosby - Silent Night', uri: 'track1.mp3' },
        { title: 'Frank Sinatra - White Christmas', uri: 'track2.mp3' },
      ],
    };

    const result = await getSortedMixes();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('slug', '2024');
    expect(result[0]).toHaveProperty('frontmatter');
    expect(result[0]).toHaveProperty('playlist');
    expect(result[0].playlist).toHaveLength(2);
    expect(result[0].playlist[0].name).toBe('Bing Crosby');
    expect(result[0].playlist[0].singer).toBe('Silent Night');
  });

  test('falls back to Spotify tracks when M3U8 file not found', async () => {
    mockReaddirSync.mockReturnValue(['2022']);
    mockExistsSync.mockReturnValue(false);
    mockReadFileSync.mockImplementation((path) => {
      if (path.includes('.md')) {
        return Buffer.from(mockMarkdownContent);
      }
      throw new Error('M3U8 file not found');
    });

    mockMatter.mockReturnValue({
      data: {
        title: 2022,
        description: 'Holiday music mix for 2022',
        date: new Date('2022-12-25'),
        tracklist: [
          { name: 'Last Christmas', artist: 'Wham!' },
          { name: 'All I Want for Christmas', singer: 'Mariah Carey' },
        ],
      },
      excerpt: 'Spotify-powered mix',
      content: '# HBBJ 2022',
    });

    const result = await getSortedMixes();

    expect(result).toBeDefined();
    expect(result[0].playlist).toHaveLength(2);
    expect(result[0].playlist[0]).toEqual({
      name: 'Last Christmas',
      singer: 'Wham!',
      musicSrc: '',
      cover: '/2022/2022.jpg',
    });
    expect(result[0].playlist[1].singer).toBe('Mariah Carey');
  });

  test('returns empty playlist when M3U8 missing and no Spotify tracks', async () => {
    mockReaddirSync.mockReturnValue(['2021']);
    mockExistsSync.mockReturnValue(false);
    mockReadFileSync.mockImplementation((path) => {
      if (path.includes('.md')) {
        return Buffer.from(mockMarkdownContent);
      }
      throw new Error('M3U8 file not found');
    });

    mockMatter.mockReturnValue({
      data: {
        title: 2021,
        description: 'Holiday music mix for 2021',
        date: new Date('2021-12-25'),
      },
      excerpt: 'Mix without playlist',
      content: '# HBBJ 2021',
    });

    const result = await getSortedMixes();

    expect(result).toBeDefined();
    expect(result[0].playlist).toEqual([]);
  });

  test('handles empty M3U8 playlist correctly', async () => {
    mockReaddirSync.mockReturnValue(['2020']);
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockImplementation((path) => {
      if (path.includes('.md')) {
        return Buffer.from(mockMarkdownContent);
      }
      if (path.includes('.m3u8')) {
        return '#EXTM3U';
      }
      return '';
    });

    mockMatter.mockReturnValue({
      data: {
        title: 2020,
        description: 'Holiday music mix for 2020',
        date: new Date('2020-12-25'),
      },
      excerpt: 'Empty playlist mix',
      content: '# HBBJ 2020',
    });

    mockParserManifest = {
      segments: [],
    };

    const result = await getSortedMixes();

    expect(result).toBeDefined();
    expect(result[0].playlist).toEqual([]);
  });

  test('sorts mixes by date in descending order', async () => {
    mockReaddirSync.mockReturnValue(['2024', '2022', '2023']);
    mockExistsSync.mockReturnValue(false);
    mockReadFileSync.mockImplementation((_path) => Buffer.from(mockMarkdownContent));

    let callCount = 0;
    mockMatter.mockImplementation(() => {
      const dates = [new Date('2024-12-25'), new Date('2022-12-25'), new Date('2023-12-25')];
      const titles = [2024, 2022, 2023];
      return {
        data: {
          title: titles[callCount],
          date: dates[callCount++],
        },
        excerpt: '',
        content: '',
      };
    });

    const result = await getSortedMixes();

    expect(result).toHaveLength(3);
    expect(result[0].frontmatter.title).toBe(2024);
    expect(result[1].frontmatter.title).toBe(2023);
    expect(result[2].frontmatter.title).toBe(2022);
  });

  test('handles invalid playlist data gracefully', async () => {
    mockReaddirSync.mockReturnValue(['2019']);
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockImplementation((path) => {
      if (path.includes('.md')) {
        return Buffer.from(mockMarkdownContent);
      }
      if (path.includes('.m3u8')) {
        return null;
      }
      return '';
    });

    mockMatter.mockReturnValue({
      data: {
        title: 2019,
        date: new Date('2019-12-25'),
      },
      excerpt: '',
      content: '',
    });

    const result = await getSortedMixes();

    expect(result).toBeDefined();
    expect(result[0].playlist).toEqual([]);
  });

  test('handles playlist with malformed track titles', async () => {
    mockReaddirSync.mockReturnValue(['2018']);
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockImplementation((path) => {
      if (path.includes('.md')) {
        return Buffer.from(mockMarkdownContent);
      }
      if (path.includes('.m3u8')) {
        return '#EXTM3U\n#EXTINF:-1,\ntrack.mp3';
      }
      return '';
    });

    mockMatter.mockReturnValue({
      data: {
        title: 2018,
        date: new Date('2018-12-25'),
      },
      excerpt: '',
      content: '',
    });

    mockParserManifest = {
      segments: [
        { title: null, uri: 'track.mp3' },
        { uri: 'track2.mp3' }, // No title property
      ],
    };

    const result = await getSortedMixes();

    expect(result).toBeDefined();
    expect(result[0].playlist).toHaveLength(2);
    expect(result[0].playlist[0].name).toBe('Unknown');
    expect(result[0].playlist[0].singer).toBe('Unknown');
    expect(result[0].playlist[1].name).toBe('Unknown');
    expect(result[0].playlist[1].singer).toBe('Unknown');
  });

  test('handles playlist with empty string in title parts', async () => {
    mockReaddirSync.mockReturnValue(['2017']);
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockImplementation((path) => {
      if (path.includes('.md')) {
        return Buffer.from(mockMarkdownContent);
      }
      if (path.includes('.m3u8')) {
        return '#EXTM3U';
      }
      return '';
    });

    mockMatter.mockReturnValue({
      data: {
        title: 2017,
        date: new Date('2017-12-25'),
      },
      excerpt: '',
      content: '',
    });

    mockParserManifest = {
      segments: [
        { title: ' - Artist Name', uri: 'track1.mp3' }, // Empty artist part
        { title: 'Song Name - ', uri: 'track2.mp3' }, // Empty song part
        { title: 'Valid Artist - Valid Song', uri: 'track3.mp3' },
      ],
    };

    const result = await getSortedMixes();

    expect(result).toBeDefined();
    expect(result[0].playlist).toHaveLength(3);
    expect(result[0].playlist[0].name).toBe(''); // Empty string after trim stays empty (truthy check passes)
    expect(result[0].playlist[0].singer).toBe('Artist Name');
    expect(result[0].playlist[1].name).toBe('Song Name');
    expect(result[0].playlist[1].singer).toBe(''); // Empty string after trim stays empty (truthy check passes)
    expect(result[0].playlist[2].name).toBe('Valid Artist');
    expect(result[0].playlist[2].singer).toBe('Valid Song');
  });
});

describe('getPostsSlugs', () => {
  beforeEach(() => {
    mockReaddirSync.mockClear();
  });

  test('happy path returns array of slug objects', () => {
    mockReaddirSync.mockReturnValue(['2024', '2023']);

    const result = getPostsSlugs();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      params: { slug: '2024' },
    });
    expect(result[1]).toEqual({
      params: { slug: '2023' },
    });
  });

  test('returns empty array when no folders found', () => {
    mockReaddirSync.mockReturnValue([]);

    const result = getPostsSlugs();

    expect(result).toEqual([]);
  });
});

describe('getPostBySlug', () => {
  beforeEach(() => {
    clearCache(); // Clear the cached mixes between tests
    mockReaddirSync.mockClear();
    mockReadFileSync.mockClear();
    mockExistsSync.mockClear();
    mockMatter.mockClear();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(process, 'cwd').mockReturnValue('/test');
  });

  afterEach(() => {
    console.error.mockRestore();
    process.cwd.mockRestore();
  });

  test('happy path returns mix with previous and next posts', async () => {
    mockReaddirSync.mockReturnValue(['2024', '2023', '2022']);
    mockExistsSync.mockReturnValue(false);
    mockReadFileSync.mockImplementation((_path) => Buffer.from(mockMarkdownContent));

    let callCount = 0;
    mockMatter.mockImplementation(() => {
      const dates = [new Date('2024-12-25'), new Date('2023-12-25'), new Date('2022-12-25')];
      const titles = [2024, 2023, 2022];
      return {
        data: {
          title: titles[callCount],
          date: dates[callCount++],
        },
        excerpt: 'Excerpt',
        content: 'Content',
      };
    });

    const result = await getPostBySlug('2023');

    expect(result).toBeDefined();
    expect(result.frontmatter.title).toBe(2023);
    expect(result.previousPost).toBeDefined();
    expect(result.previousPost.slug).toBe('2022');
    expect(result.nextPost).toBeDefined();
    expect(result.nextPost.slug).toBe('2024');
  });

  test('first post has no next post', async () => {
    mockReaddirSync.mockReturnValue(['2024', '2023']);
    mockExistsSync.mockReturnValue(false);
    mockReadFileSync.mockImplementation((_path) => Buffer.from(mockMarkdownContent));

    let callCount = 0;
    mockMatter.mockImplementation(() => {
      const dates = [new Date('2024-12-25'), new Date('2023-12-25')];
      const titles = [2024, 2023];
      return {
        data: {
          title: titles[callCount],
          date: dates[callCount++],
        },
        excerpt: 'Excerpt',
        content: 'Content',
      };
    });

    const result = await getPostBySlug('2024');

    expect(result.nextPost).toBeUndefined();
    expect(result.previousPost).toBeDefined();
    expect(result.previousPost.slug).toBe('2023');
  });

  test('last post has no previous post', async () => {
    mockReaddirSync.mockReturnValue(['2024', '2023']);
    mockExistsSync.mockReturnValue(false);
    mockReadFileSync.mockImplementation((_path) => Buffer.from(mockMarkdownContent));

    let callCount = 0;
    mockMatter.mockImplementation(() => {
      const dates = [new Date('2024-12-25'), new Date('2023-12-25')];
      const titles = [2024, 2023];
      return {
        data: {
          title: titles[callCount],
          date: dates[callCount++],
        },
        excerpt: 'Excerpt',
        content: 'Content',
      };
    });

    const result = await getPostBySlug('2023');

    expect(result.previousPost).toBeUndefined();
    expect(result.nextPost).toBeDefined();
    expect(result.nextPost.slug).toBe('2024');
  });
});
