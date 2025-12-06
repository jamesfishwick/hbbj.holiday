import { describe, expect, test } from '@jest/globals';

// Mock the config
jest.mock('@config/seo.json', () => ({
  siteMetadata: {
    title: 'HBBJ Holiday',
    author: 'Test Author',
    description: 'Test Description',
    siteUrl: 'https://test.com',
  },
}));

const { getSiteMetaData } = require('../../utils/helpers');

describe('getSiteMetaData', () => {
  test('returns site metadata from config', () => {
    const result = getSiteMetaData();

    expect(result).toBeDefined();
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('author');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('siteUrl');
  });

  test('returns correct metadata values', () => {
    const result = getSiteMetaData();

    expect(result.title).toBe('HBBJ Holiday');
    expect(result.author).toBe('Test Author');
    expect(result.description).toBe('Test Description');
    expect(result.siteUrl).toBe('https://test.com');
  });

  test('returns object type', () => {
    const result = getSiteMetaData();

    expect(typeof result).toBe('object');
    expect(result).not.toBeNull();
    expect(Array.isArray(result)).toBe(false);
  });
});
