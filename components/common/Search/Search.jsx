import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/router";

export default function Search() {
  const router = useRouter();
  const searchRef = useRef(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchEndpoint = (query) => `/api/search?q=${query}`;

  const onChange = useCallback(async (event) => {
    const query = event.target.value;
    setQuery(query);
    setError(null);

    if (query.length) {
      setIsLoading(true);
      try {
        const res = await fetch(searchEndpoint(query));
        if (!res.ok) throw new Error("Failed to search");
        const data = await res.json();
        setResults(data.results);
      } catch (err) {
        console.error("Search error:", err);
        setError("An error occurred while searching");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setResults([]);
    }
  }, []);

  const onFocus = useCallback(() => {
    setActive(true);
    window.addEventListener("click", onClick);
  }, []);

  const onClick = useCallback((event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setActive(false);
      window.removeEventListener("click", onClick);
    }
  }, []);

  const onResultClick = (id) => {
    router.push(`/mix/${id}`);
    setActive(false);
    setQuery("");
    setResults([]);
    setError(null);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto" ref={searchRef}>
      <div className="relative">
        <input
          className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg 
                   focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal
                   dark:bg-dark-blue dark:text-white dark:border-gray-600 
                   dark:focus:border-light-blue dark:focus:ring-light-blue
                   placeholder-gray-500 dark:placeholder-gray-400"
          onChange={onChange}
          onFocus={onFocus}
          placeholder="Search mixes and tracks..."
          type="text"
          value={query}
        />

        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-teal rounded-full animate-spin" />
          </div>
        )}
      </div>

      {active && !error && results.length > 0 && (
        <ul
          className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg 
                     dark:bg-dark-blue dark:border-gray-600 overflow-hidden z-50"
        >
          {results.map(({ id, title, description, matchingTracks }) => (
            <li
              key={id}
              className="border-b last:border-b-0 border-gray-200 dark:border-gray-600
                       cursor-pointer transition-colors duration-150
                       hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => onResultClick(id)}
            >
              <div className="px-4 py-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {title}
                </h4>
                {description && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {description}
                  </p>
                )}
                {matchingTracks && matchingTracks.length > 0 && (
                  <div className="mt-2 pl-3 border-l-2 border-teal dark:border-light-blue">
                    {matchingTracks.map((track, index) => (
                      <p
                        key={index}
                        className="text-sm text-gray-600 dark:text-gray-400"
                      >
                        {track.artist} - {track.name}
                      </p>
                    ))}
                    {matchingTracks.length === 3 && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 italic">
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

      {active && !isLoading && error && (
        <div
          className="absolute w-full mt-2 p-4 text-center bg-white border border-gray-300 
                      rounded-lg shadow-lg dark:bg-dark-blue dark:border-gray-600 z-50"
        >
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      )}

      {active && query && !isLoading && !error && results.length === 0 && (
        <div
          className="absolute w-full mt-2 p-4 text-center bg-white border border-gray-300 
                      rounded-lg shadow-lg dark:bg-dark-blue dark:border-gray-600 z-50"
        >
          <p className="text-gray-600 dark:text-gray-400">
            No results found for &ldquo;{query}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
