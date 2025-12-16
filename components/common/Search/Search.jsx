import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function Search() {
  const router = useRouter();
  const searchRef = useRef(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Load search data on component mount
  useEffect(() => {
    const loadSearchData = async () => {
      try {
        const res = await fetch('/search-data.json');
        if (!res.ok) throw new Error('Failed to load search data');
        const data = await res.json();
        setSearchData(data);
      } catch (err) {
        console.error('Failed to load search data:', err);
        setError('Search is currently unavailable');
      }
    };

    loadSearchData();
  }, []);

  const performSearch = useCallback(
    (searchQuery) => {
      if (!searchData || !searchQuery) {
        return [];
      }

      const query = searchQuery.toLowerCase();

      return searchData
        .filter((mix) => {
          // Search in mix metadata
          const contentSearchable = [mix.title, mix.description, mix.contentPreview]
            .join(' ')
            .toLowerCase();

          // Search in playlist data
          const playlistSearchable = mix.tracks
            .map((track) => `${track.name} ${track.artist}`)
            .join(' ')
            .toLowerCase();

          // Match if query is found in either content or playlist
          return contentSearchable.includes(query) || playlistSearchable.includes(query);
        })
        .map((mix) => {
          // Find matching tracks if any
          const matchingTracks = mix.tracks
            .filter(
              (track) =>
                track.name.toLowerCase().includes(query) ||
                track.artist.toLowerCase().includes(query)
            )
            .slice(0, 3); // Limit to first 3 matching tracks

          return {
            id: mix.id,
            title: mix.title,
            description: mix.description,
            year: mix.title,
            matchingTracks: matchingTracks.map((track) => ({
              name: track.name,
              artist: track.artist,
            })),
          };
        });
    },
    [searchData]
  );

  const onClick = useCallback((event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setActive(false);
      window.removeEventListener('click', onClick);
    }
  }, []);

  const onFocus = useCallback(() => {
    setActive(true);
    window.addEventListener('click', onClick);
  }, [onClick]);

  const onChange = useCallback(
    (event) => {
      const query = event.target.value;
      setQuery(query);
      setError(null);
      setFocusedIndex(-1); // Reset focus when query changes

      if (query.length) {
        setIsLoading(true);
        try {
          const searchResults = performSearch(query);
          setResults(searchResults);
        } catch (err) {
          console.error('Search error:', err);
          setError('An error occurred while searching');
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    },
    [performSearch]
  );

  const onResultClick = useCallback(
    (id) => {
      router.push(`/mix/${id}`);
      setActive(false);
      setQuery('');
      setResults([]);
      setError(null);
      setFocusedIndex(-1);
    },
    [router]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (!results.length) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex((prev) => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          event.preventDefault();
          if (focusedIndex >= 0 && results[focusedIndex]) {
            onResultClick(results[focusedIndex].id);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setActive(false);
          setQuery('');
          setResults([]);
          setFocusedIndex(-1);
          break;
        default:
          break;
      }
    },
    [results, focusedIndex, onResultClick]
  );

  return (
    <div className="relative w-full max-w-lg mx-auto" ref={searchRef}>
      <div className="relative">
        <label htmlFor="search-input" className="sr-only">
          Search mixes and tracks
        </label>

        {/* Search Icon */}
        <div className="absolute left-3 top-2.5 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          id="search-input"
          className="w-full pl-10 pr-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg
                   focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal focus:scale-102 focus:shadow-lg
                   dark:bg-dark-blue dark:text-white dark:border-gray-600
                   dark:focus:border-light-blue dark:focus:ring-light-blue
                   placeholder-gray-500 dark:placeholder-gray-400
                   transition-all duration-normal"
          onChange={onChange}
          onFocus={onFocus}
          onKeyDown={handleKeyDown}
          placeholder="Search mixes and tracks..."
          type="search"
          value={query}
          aria-label="Search mixes and tracks"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-activedescendant={
            focusedIndex >= 0 && results[focusedIndex]
              ? `result-${results[focusedIndex].id}`
              : undefined
          }
        />

        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <svg
              className="w-5 h-5 text-teal dark:text-light-blue animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Loading"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Screen reader announcements */}
      <output aria-live="polite" aria-atomic="true" className="sr-only">
        {isLoading && 'Searching...'}
        {!isLoading &&
          results.length > 0 &&
          `${results.length} result${results.length === 1 ? '' : 's'} found`}
        {!isLoading && query && results.length === 0 && !error && 'No results found'}
        {error && error}
      </output>

      {active && !error && results.length > 0 && (
        <ul
          id="search-results"
          className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl
                     dark:bg-dark-blue dark:border-gray-600 overflow-hidden z-50
                     animate-slideIn"
          style={{
            animation: 'slideIn 200ms ease-out',
          }}
        >
          {results.map(({ id, title, description, matchingTracks }, index) => (
            <li
              key={id}
              id={`result-${id}`}
              className={`border-b last:border-b-0 border-gray-200 dark:border-gray-600
                       cursor-pointer transition-all duration-200
                       hover:bg-gray-50 dark:hover:bg-gray-800 hover:pl-2
                       ${focusedIndex === index ? 'bg-teal bg-opacity-10 dark:bg-light-blue dark:bg-opacity-10 pl-2 border-l-4 border-l-teal dark:border-l-light-blue' : ''}`}
              onClick={() => onResultClick(id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onResultClick(id);
                }
              }}
              tabIndex={-1}
              style={{
                animation: `slideIn ${150 + index * 50}ms ease-out`,
              }}
            >
              <div className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {/* Year Badge */}
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal bg-opacity-20 text-teal dark:bg-light-blue dark:bg-opacity-20 dark:text-light-blue">
                    {title}
                  </span>
                  <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
                </div>
                {description && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 no-underline">
                    {description}
                  </p>
                )}
                {matchingTracks && matchingTracks.length > 0 && (
                  <div className="mt-2 pl-3 border-l-2 border-teal dark:border-light-blue space-y-1">
                    {matchingTracks.map((track) => (
                      <div
                        key={`${track.artist}-${track.name}`}
                        className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        {/* Music Note Icon */}
                        <svg
                          className="w-4 h-4 flex-shrink-0 mt-0.5 text-teal dark:text-light-blue"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19V6l12-2v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-2"
                          />
                        </svg>
                        <span className="no-underline">
                          {track.artist} - {track.name}
                        </span>
                      </div>
                    ))}
                    {matchingTracks.length === 3 && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 italic no-underline pl-6">
                        and more matches...
                      </p>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {active && !isLoading && error && (
        <div
          className="absolute w-full mt-2 p-6 text-center bg-white border border-red-300
                      rounded-lg shadow-xl dark:bg-dark-blue dark:border-red-600 z-50
                      animate-slideIn"
          style={{
            animation: 'slideIn 200ms ease-out',
          }}
        >
          <svg
            className="w-12 h-12 mx-auto mb-3 text-red-500 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-label="Error"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      {active && query && !isLoading && !error && results.length === 0 && (
        <div
          className="absolute w-full mt-2 p-6 text-center bg-white border border-gray-300
                      rounded-lg shadow-xl dark:bg-dark-blue dark:border-gray-600 z-50
                      animate-slideIn"
          style={{
            animation: 'slideIn 200ms ease-out',
          }}
        >
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-label="No results"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">No results found</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We couldn&rsquo;t find any mixes or tracks matching &ldquo;{query}&rdquo;
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
            Try different keywords or browse all mixes
          </p>
        </div>
      )}
    </div>
  );
}
