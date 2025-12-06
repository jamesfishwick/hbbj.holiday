import dynamic from 'next/dynamic';

const ReactJkMusicPlayer = dynamic(() => import('react-jinke-music-player'), {
  ssr: false,
});

export default ReactJkMusicPlayer;
