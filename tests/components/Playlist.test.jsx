import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { PlaylistDisplay } from '../../components/common/Playlist/Playlist';
import { mockPlaylist } from '../fixtures/mock-data';

describe('PlaylistDisplay Component', () => {
  test('happy path renders playlist with tracks', () => {
    render(<PlaylistDisplay tracks={mockPlaylist} />);

    expect(screen.getByText('Tracklist')).toBeDefined();
    expect(screen.getByText('3 tracks')).toBeDefined();
    expect(screen.getByText('Silent Night')).toBeDefined();
    expect(screen.getByText('Bing Crosby')).toBeDefined();
  });

  test('renders all tracks in order', () => {
    render(<PlaylistDisplay tracks={mockPlaylist} />);

    const trackElements = screen.getAllByText(/Silent Night|White Christmas|Jingle Bells/);
    expect(trackElements.length).toBeGreaterThanOrEqual(3);
  });

  test('displays track numbers correctly', () => {
    render(<PlaylistDisplay tracks={mockPlaylist} />);

    expect(screen.getByText('01')).toBeDefined();
    expect(screen.getByText('02')).toBeDefined();
    expect(screen.getByText('03')).toBeDefined();
  });

  test('displays track count correctly', () => {
    render(<PlaylistDisplay tracks={mockPlaylist} />);

    expect(screen.getByText('3 tracks')).toBeDefined();
  });

  test('returns null when tracks is null', () => {
    const { container } = render(<PlaylistDisplay tracks={null} />);

    expect(container.firstChild).toBeNull();
  });

  test('returns null when tracks is undefined', () => {
    const { container } = render(<PlaylistDisplay tracks={undefined} />);

    expect(container.firstChild).toBeNull();
  });

  test('returns null when tracks is empty array', () => {
    const { container } = render(<PlaylistDisplay tracks={[]} />);

    expect(container.firstChild).toBeNull();
  });

  test('renders single track correctly', () => {
    const singleTrack = [mockPlaylist[0]];

    render(<PlaylistDisplay tracks={singleTrack} />);

    expect(screen.getByText('1 tracks')).toBeDefined();
    expect(screen.getByText('Silent Night')).toBeDefined();
    expect(screen.getByText('01')).toBeDefined();
  });

  test('renders many tracks correctly', () => {
    const manyTracks = Array.from({ length: 20 }, (_, i) => ({
      name: `Track ${i + 1}`,
      singer: `Artist ${i + 1}`,
      musicSrc: `/track${i + 1}.mp3`,
      cover: '/cover.jpg',
    }));

    render(<PlaylistDisplay tracks={manyTracks} />);

    expect(screen.getByText('20 tracks')).toBeDefined();
    expect(screen.getByText('Track 1')).toBeDefined();
    expect(screen.getByText('Track 20')).toBeDefined();
  });

  test('displays track with duration when provided', () => {
    const tracksWithDuration = [
      {
        ...mockPlaylist[0],
        duration: 180, // 3 minutes
      },
    ];

    render(<PlaylistDisplay tracks={tracksWithDuration} />);

    expect(screen.getByText('3:00')).toBeDefined();
  });

  test('formatDuration utility formats seconds correctly', () => {
    const tracksWithVariousDurations = [
      { name: 'Song 1', singer: 'Artist 1', duration: 65 }, // 1:05
      { name: 'Song 2', singer: 'Artist 2', duration: 125 }, // 2:05
      { name: 'Song 3', singer: 'Artist 3', duration: 0 }, // --:--
    ];

    render(<PlaylistDisplay tracks={tracksWithVariousDurations} />);

    expect(screen.getByText('1:05')).toBeDefined();
    expect(screen.getByText('2:05')).toBeDefined();
  });

  test('handles tracks without duration gracefully', () => {
    const tracksWithoutDuration = [
      {
        name: 'Song Without Duration',
        singer: 'Unknown Artist',
      },
    ];

    render(<PlaylistDisplay tracks={tracksWithoutDuration} />);

    expect(screen.getByText('Song Without Duration')).toBeDefined();
    expect(screen.getByText('Unknown Artist')).toBeDefined();
  });

  test('applies correct CSS classes for styling', () => {
    const { container } = render(<PlaylistDisplay tracks={mockPlaylist} />);

    const playlistContainer = container.querySelector('.bg-dark-blue');
    expect(playlistContainer).toBeDefined();
  });

  test('renders track artist and name in correct order', () => {
    const track = [
      {
        name: 'Amazing Song',
        singer: 'Famous Artist',
        musicSrc: '/song.mp3',
        cover: '/cover.jpg',
      },
    ];

    render(<PlaylistDisplay tracks={track} />);

    const nameElement = screen.getByText('Amazing Song');
    const artistElement = screen.getByText('Famous Artist');

    expect(nameElement).toBeDefined();
    expect(artistElement).toBeDefined();
  });

  test('handles long track names without breaking layout', () => {
    const longNameTrack = [
      {
        name: 'This is an extremely long track name that should be handled gracefully by the component',
        singer: 'Artist with a very long name that might cause layout issues',
        musicSrc: '/track.mp3',
        cover: '/cover.jpg',
      },
    ];

    render(<PlaylistDisplay tracks={longNameTrack} />);

    expect(
      screen.getByText(
        'This is an extremely long track name that should be handled gracefully by the component'
      )
    ).toBeDefined();
  });

  test('renders music note icon in header', () => {
    const { container } = render(<PlaylistDisplay tracks={mockPlaylist} />);

    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toBeDefined();
  });

  test('applies hover styles on track rows', () => {
    const { container } = render(<PlaylistDisplay tracks={mockPlaylist} />);

    const trackRow = container.querySelector('.hover\\:bg-light-blue');
    expect(trackRow).toBeDefined();
  });

  test('alternates row background colors', () => {
    const { container } = render(<PlaylistDisplay tracks={mockPlaylist} />);

    const evenRows = container.querySelectorAll('.bg-white');
    expect(evenRows.length).toBeGreaterThan(0);
  });

  test('pads track numbers with leading zero', () => {
    const nineTrackPlaylist = Array.from({ length: 9 }, (_, i) => ({
      name: `Track ${i + 1}`,
      singer: `Artist ${i + 1}`,
      musicSrc: `/track${i + 1}.mp3`,
      cover: '/cover.jpg',
    }));

    render(<PlaylistDisplay tracks={nineTrackPlaylist} />);

    expect(screen.getByText('01')).toBeDefined();
    expect(screen.getByText('09')).toBeDefined();
  });

  test('handles track numbers above 9 correctly', () => {
    const tenTrackPlaylist = Array.from({ length: 12 }, (_, i) => ({
      name: `Track ${i + 1}`,
      singer: `Artist ${i + 1}`,
      musicSrc: `/track${i + 1}.mp3`,
      cover: '/cover.jpg',
    }));

    render(<PlaylistDisplay tracks={tenTrackPlaylist} />);

    expect(screen.getByText('10')).toBeDefined();
    expect(screen.getByText('11')).toBeDefined();
    expect(screen.getByText('12')).toBeDefined();
  });
});
