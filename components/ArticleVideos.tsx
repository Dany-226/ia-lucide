'use client';

import { useEffect } from 'react';

// Lecture automatique et en boucle des vidéos du corps d'article (.prose-ia video),
// déclenchée seulement quand la vidéo est visible à 50 % : avec preload="none",
// rien n'est téléchargé tant que le lecteur n'y arrive pas (poids de page et LCP préservés).
// - prefers-reduced-motion : aucune lecture automatique, la vidéo reste au clic.
// - Si le lecteur met en pause lui-même, la vidéo ne repart plus seule.
export default function ArticleVideos() {
  useEffect(() => {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('.prose-ia video'));
    if (videos.length === 0) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    videos.forEach((v) => {
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
    });
    if (reduce || !('IntersectionObserver' in window)) return;

    const auto = new WeakSet<HTMLVideoElement>(); // pauses déclenchées par ce script
    const userPaused = new WeakSet<HTMLVideoElement>();
    const onPause = (e: Event) => {
      const v = e.target as HTMLVideoElement;
      if (auto.has(v)) auto.delete(v);
      else if (!v.ended) userPaused.add(v);
    };
    const onPlay = (e: Event) => userPaused.delete(e.target as HTMLVideoElement);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            if (v.paused && !userPaused.has(v)) v.play().catch(() => {});
          } else if (!v.paused) {
            auto.add(v);
            v.pause();
          }
        });
      },
      { threshold: 0.5 },
    );

    videos.forEach((v) => {
      v.addEventListener('pause', onPause);
      v.addEventListener('play', onPlay);
      io.observe(v);
    });
    return () => {
      io.disconnect();
      videos.forEach((v) => {
        v.removeEventListener('pause', onPause);
        v.removeEventListener('play', onPlay);
      });
    };
  }, []);

  return null;
}
