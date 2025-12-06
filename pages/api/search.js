import { getSortedMixes } from '@utils/mixes';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
    return;
  }

  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    res.status(200).json({ results: [] });
    return;
  }

  try {
    const mixes = await getSortedMixes();
    const searchQuery = q.toLowerCase();

    const results = mixes
      .filter((mix) => {
        // Search in markdown content
        const contentSearchable = [
          mix.frontmatter.title,
          mix.frontmatter.description || '',
          mix.content || '',
        ]
          .join(' ')
          .toLowerCase();

        // Search in playlist data
        const playlistSearchable = mix.playlist
          ? mix.playlist
              .map((track) => `${track.name} ${track.singer}`)
              .join(' ')
              .toLowerCase()
          : '';

        // Match if query is found in either content or playlist
        return contentSearchable.includes(searchQuery) || playlistSearchable.includes(searchQuery);
      })
      .map((mix) => {
        // Find matching tracks if any
        const matchingTracks = mix.playlist
          ? mix.playlist
              .filter(
                (track) =>
                  track.name.toLowerCase().includes(searchQuery) ||
                  track.singer.toLowerCase().includes(searchQuery)
              )
              .slice(0, 3) // Limit to first 3 matching tracks
          : [];

        return {
          id: mix.slug,
          title: mix.frontmatter.title,
          description: mix.frontmatter.description || '',
          year: mix.frontmatter.title, // The title is the year in your case
          matchingTracks: matchingTracks.map((track) => ({
            name: track.name,
            artist: track.singer,
          })),
        };
      });

    res.status(200).json({ results });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Search error:', error);
    res.status(500).json({
      error: 'Failed to search mixes',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
