// Mock data for testing

export const mockMixFrontmatter = {
  title: 2024,
  description: 'Holiday music mix for 2024',
  date: new Date('2024-12-25'),
};

export const mockPlaylist = [
  {
    name: 'Silent Night',
    singer: 'Bing Crosby',
    musicSrc: '/2024/track1.mp3',
    cover: '/2024/2024.jpg',
  },
  {
    name: 'White Christmas',
    singer: 'Frank Sinatra',
    musicSrc: '/2024/track2.mp3',
    cover: '/2024/2024.jpg',
  },
  {
    name: 'Jingle Bells',
    singer: 'Ella Fitzgerald',
    musicSrc: '/2024/track3.mp3',
    cover: '/2024/2024.jpg',
  },
];

export const mockMixWithPlaylist = {
  slug: '2024',
  frontmatter: mockMixFrontmatter,
  excerpt: 'A collection of classic holiday songs',
  content: '# HBBJ 2024\n\nWelcome to the 2024 holiday mix!',
  playlist: mockPlaylist,
};

export const mockMixWithoutPlaylist = {
  slug: '2023',
  frontmatter: {
    title: 2023,
    description: 'Holiday music mix for 2023',
    date: new Date('2023-12-25'),
  },
  excerpt: 'Another great collection',
  content: '# HBBJ 2023\n\nWelcome to the 2023 holiday mix!',
  playlist: [],
};

export const mockMixWithSpotifyTracks = {
  slug: '2022',
  frontmatter: {
    title: 2022,
    description: 'Holiday music mix for 2022',
    date: new Date('2022-12-25'),
    spotifyTracks: [
      { name: 'Last Christmas', artist: 'Wham!' },
      { name: 'All I Want for Christmas', singer: 'Mariah Carey' },
    ],
  },
  excerpt: 'Spotify-powered mix',
  content: '# HBBJ 2022\n\nWelcome to the 2022 holiday mix!',
  playlist: [
    {
      name: 'Last Christmas',
      singer: 'Wham!',
      musicSrc: '',
      cover: '/2022/2022.jpg',
    },
    {
      name: 'All I Want for Christmas',
      singer: 'Mariah Carey',
      musicSrc: '',
      cover: '/2022/2022.jpg',
    },
  ],
};

export const mockM3U8Content = `#EXTM3U
#EXTINF:180,Bing Crosby - Silent Night
track1.mp3
#EXTINF:200,Frank Sinatra - White Christmas
track2.mp3
#EXTINF:150,Ella Fitzgerald - Jingle Bells
track3.mp3`;

export const mockMarkdownContent = `---
title: 2024
description: Holiday music mix for 2024
date: 2024-12-25
---

# HBBJ 2024

Welcome to the 2024 holiday mix!`;

export const mockMixFolders = [
  {
    directory: '2024',
    filename: '2024.md',
    playlist: '2024.m3u8',
  },
  {
    directory: '2023',
    filename: '2023.md',
    playlist: '2023.m3u8',
  },
];

export const mockSearchResults = [
  {
    id: '2024',
    title: 2024,
    description: 'Holiday music mix for 2024',
    year: 2024,
    matchingTracks: [
      { name: 'Silent Night', artist: 'Bing Crosby' },
      { name: 'White Christmas', artist: 'Frank Sinatra' },
    ],
  },
];
