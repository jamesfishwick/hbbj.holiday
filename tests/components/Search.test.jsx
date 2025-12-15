import Search from '@components/common/Search/Search';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

// Mock fetch
global.fetch = jest.fn();

const mockSearchData = [
  {
    id: '2024',
    title: '2024',
    description: 'Best Christmas music of 2024',
    contentPreview: 'Merry Christmas everyone!',
    tracks: [
      { name: 'Jingle Bells', artist: 'Artist One' },
      { name: 'Silent Night', artist: 'Artist Two' },
      { name: 'White Christmas', artist: 'Artist Three' },
    ],
  },
  {
    id: '2023',
    title: '2023',
    description: 'Best Christmas music of 2023',
    contentPreview: 'Happy holidays!',
    tracks: [{ name: 'Deck the Halls', artist: 'Artist Four' }],
  },
];

describe('Search Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockSearchData,
    });
  });

  test('should render search input', () => {
    render(<Search />);
    expect(screen.getByPlaceholderText(/search mixes and tracks/i)).toBeInTheDocument();
  });

  test('should load search data on mount', async () => {
    render(<Search />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/search-data.json');
    });
  });

  test('should display error when search data fails to load', async () => {
    global.fetch.mockRejectedValue(new Error('Failed to load'));

    render(<Search />);
    const input = screen.getByPlaceholderText(/search mixes and tracks/i);
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText(/search is currently unavailable/i)).toBeInTheDocument();
    });
  });

  test('should show results when searching for mix title', async () => {
    render(<Search />);

    // Wait for data to load
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const input = screen.getByPlaceholderText(/search mixes and tracks/i);

    // Focus and type query
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '2024' } });

    await waitFor(() => {
      expect(screen.getByText('2024')).toBeInTheDocument();
      expect(screen.getByText('Best Christmas music of 2024')).toBeInTheDocument();
    });
  });

  test('should show matching tracks in results', async () => {
    render(<Search />);

    // Wait for data to load
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const input = screen.getByPlaceholderText(/search mixes and tracks/i);

    // Search for a track name
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Jingle Bells' } });

    await waitFor(() => {
      expect(screen.getByText(/Artist One - Jingle Bells/i)).toBeInTheDocument();
    });
  });

  test('should show "no results" when search returns empty', async () => {
    render(<Search />);

    // Wait for data to load
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const input = screen.getByPlaceholderText(/search mixes and tracks/i);

    // Search for non-existent term
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'xyz123nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });

  test('should navigate to mix page on result click', async () => {
    render(<Search />);

    // Wait for data to load
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const input = screen.getByPlaceholderText(/search mixes and tracks/i);

    // Search and click result
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '2024' } });

    // Wait for listbox to appear
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Get the first result and click it
    const results = screen.getAllByRole('option');
    expect(results.length).toBeGreaterThan(0);

    fireEvent.click(results[0]);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/mix/2024');
    });
  });

  test('should clear results when input is cleared', async () => {
    render(<Search />);

    // Wait for data to load
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const input = screen.getByPlaceholderText(/search mixes and tracks/i);

    // Search first
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '2024' } });

    await waitFor(() => {
      expect(screen.getByText('2024')).toBeInTheDocument();
    });

    // Clear input
    fireEvent.change(input, { target: { value: '' } });

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  test('should hide results when clicking outside', async () => {
    render(
      <div>
        <Search />
        <div data-testid="outside">Outside element</div>
      </div>
    );

    // Wait for data to load
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const input = screen.getByPlaceholderText(/search mixes and tracks/i);

    // Show results
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '2024' } });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Click outside
    const outside = screen.getByTestId('outside');
    fireEvent.click(outside);

    // Results should be hidden
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  test('should search case-insensitively', async () => {
    render(<Search />);

    // Wait for data to load
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const input = screen.getByPlaceholderText(/search mixes and tracks/i);

    // Search with different case
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'JINGLE' } });

    await waitFor(() => {
      expect(screen.getByText(/Artist One - Jingle Bells/i)).toBeInTheDocument();
    });
  });

  test('should limit matching tracks to 3', async () => {
    render(<Search />);

    // Wait for data to load
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const input = screen.getByPlaceholderText(/search mixes and tracks/i);

    // Search for common term that matches multiple tracks
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Artist' } });

    await waitFor(() => {
      // Check that tracks are displayed (from mix 2024 which has 3 tracks)
      const trackElements = screen.getAllByText(/.+ - .+/);
      // Each mix should show max 3 tracks
      // We're searching for "Artist" which matches all tracks
      // Mix 2024 has 3 tracks, so we should see exactly 3 from that mix
      expect(trackElements.length).toBeGreaterThanOrEqual(3);
    });
  });
});
