export function PlaylistDisplay({ tracks = [] }) {
  if (!tracks || !Array.isArray(tracks) || tracks.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-dark-blue rounded-lg shadow-lg p-6 my-8">
      {/* Playlist Header */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          {/* Music note icon */}
          <svg
            className="w-6 h-6 text-teal dark:text-light-blue"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            role="img"
            aria-label="Music note icon"
          >
            <title>Music note icon</title>
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <h3 className="text-2xl font-bold text-dark-blue dark:text-cream">Tracklist</h3>
        </div>

        {/* Total duration if available */}
        {tracks.length > 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">{tracks.length} tracks</div>
        )}
      </div>

      {/* Track List */}
      <div className="space-y-2">
        {tracks.map((track, index) => (
          <div
            key={`${track.name}-${track.singer || track.artist}-${index}`}
            className="group flex items-center gap-4 p-3 rounded-md
                     hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {/* Track Number */}
            <span className="w-8 text-right font-mono text-sm text-gray-500 dark:text-gray-400">
              {String(index + 1).padStart(2, '0')}
            </span>

            {/* Track Info */}
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-grow">
                  <h4 className="font-medium text-dark-blue dark:text-cream">
                    {track.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{track.singer}</p>
                </div>
              </div>
            </div>

            {/* Duration if available */}
            {track.duration && (
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                {formatDuration(track.duration)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const formatDuration = (seconds) => {
  if (!seconds) return '--:--';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
};

export default PlaylistDisplay;
