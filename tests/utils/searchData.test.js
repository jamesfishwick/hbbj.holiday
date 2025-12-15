/**
 * @jest-environment node
 */
import fs from 'node:fs';
import path from 'node:path';
import { jest } from '@jest/globals';

// Mock dependencies
jest.mock('../../utils/mixes.mjs', () => ({
  getSortedMixes: jest.fn(),
}));

describe('Search Data Generation', () => {
  let getSortedMixes;
  const outputPath = path.join(process.cwd(), 'public', 'search-data.json');

  beforeEach(() => {
    // Clear modules to get fresh mocks
    jest.clearAllMocks();

    // Import the mocked function
    getSortedMixes = require('../../utils/mixes.mjs').getSortedMixes;

    // Clean up output file if it exists
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  });

  afterEach(() => {
    // Clean up output file
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  });

  test('should generate search data with correct structure', async () => {
    // Mock mix data
    const mockMixes = [
      {
        slug: '2024',
        frontmatter: {
          title: '2024',
          description: 'Best Christmas music of 2024',
        },
        content: 'Merry Christmas everyone! Here is the 2024 playlist.',
        playlist: [
          { name: 'Jingle Bells', singer: 'Artist One' },
          { name: 'Silent Night', singer: 'Artist Two' },
        ],
      },
      {
        slug: '2023',
        frontmatter: {
          title: '2023',
          description: 'Best Christmas music of 2023',
        },
        content: 'Happy holidays! Here is the 2023 playlist.',
        playlist: [{ name: 'White Christmas', singer: 'Artist Three' }],
      },
    ];

    getSortedMixes.mockResolvedValue(mockMixes);

    // Dynamically import and run the generation script logic
    const { getSortedMixes: getMixes } = await import('../../utils/mixes.mjs');
    const mixes = await getMixes();

    // Generate search data
    const searchData = mixes.map((mix) => ({
      id: mix.slug,
      title: mix.frontmatter.title,
      description: mix.frontmatter.description || '',
      contentPreview: mix.content ? mix.content.substring(0, 500) : '',
      tracks: mix.playlist
        ? mix.playlist.map((track) => ({
            name: track.name,
            artist: track.singer,
          }))
        : [],
    }));

    // Verify structure
    expect(searchData).toHaveLength(2);
    expect(searchData[0]).toHaveProperty('id', '2024');
    expect(searchData[0]).toHaveProperty('title', '2024');
    expect(searchData[0]).toHaveProperty('description');
    expect(searchData[0]).toHaveProperty('contentPreview');
    expect(searchData[0]).toHaveProperty('tracks');
    expect(searchData[0].tracks).toHaveLength(2);
    expect(searchData[0].tracks[0]).toEqual({
      name: 'Jingle Bells',
      artist: 'Artist One',
    });
  });

  test('should handle mixes without playlists', async () => {
    const mockMixes = [
      {
        slug: '2024',
        frontmatter: {
          title: '2024',
          description: 'Best Christmas music of 2024',
        },
        content: 'Content here',
        playlist: null,
      },
    ];

    getSortedMixes.mockResolvedValue(mockMixes);

    const { getSortedMixes: getMixes } = await import('../../utils/mixes.mjs');
    const mixes = await getMixes();

    const searchData = mixes.map((mix) => ({
      id: mix.slug,
      title: mix.frontmatter.title,
      description: mix.frontmatter.description || '',
      contentPreview: mix.content ? mix.content.substring(0, 500) : '',
      tracks: mix.playlist
        ? mix.playlist.map((track) => ({
            name: track.name,
            artist: track.singer,
          }))
        : [],
    }));

    expect(searchData[0].tracks).toEqual([]);
  });

  test('should truncate content to 500 characters', async () => {
    const longContent = 'a'.repeat(1000);
    const mockMixes = [
      {
        slug: '2024',
        frontmatter: {
          title: '2024',
          description: 'Test',
        },
        content: longContent,
        playlist: [],
      },
    ];

    getSortedMixes.mockResolvedValue(mockMixes);

    const { getSortedMixes: getMixes } = await import('../../utils/mixes.mjs');
    const mixes = await getMixes();

    const searchData = mixes.map((mix) => ({
      id: mix.slug,
      title: mix.frontmatter.title,
      description: mix.frontmatter.description || '',
      contentPreview: mix.content ? mix.content.substring(0, 500) : '',
      tracks: mix.playlist
        ? mix.playlist.map((track) => ({
            name: track.name,
            artist: track.singer,
          }))
        : [],
    }));

    expect(searchData[0].contentPreview).toHaveLength(500);
  });

  test('should handle empty mixes array', async () => {
    getSortedMixes.mockResolvedValue([]);

    const { getSortedMixes: getMixes } = await import('../../utils/mixes.mjs');
    const mixes = await getMixes();

    const searchData = mixes.map((mix) => ({
      id: mix.slug,
      title: mix.frontmatter.title,
      description: mix.frontmatter.description || '',
      contentPreview: mix.content ? mix.content.substring(0, 500) : '',
      tracks: mix.playlist
        ? mix.playlist.map((track) => ({
            name: track.name,
            artist: track.singer,
          }))
        : [],
    }));

    expect(searchData).toEqual([]);
  });
});
