'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevUrl = useRef('');

  const start = useCallback(() => {
    setVisible(true);
    setProgress(0);

    // Quick jump to ~30%, then slow crawl
    requestAnimationFrame(() => setProgress(30));
    timerRef.current = setTimeout(() => setProgress(60), 300);
  }, []);

  const done = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setProgress(100);
    setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 200);
  }, []);

  useEffect(() => {
    const url = pathname + searchParams.toString();
    if (prevUrl.current && prevUrl.current !== url) {
      done();
    }
    prevUrl.current = url;
  }, [pathname, searchParams, done]);

  // Intercept link clicks to trigger start
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        anchor.target === '_blank'
      ) return;

      const current = pathname + (searchParams.toString() ? '?' + searchParams.toString() : '');
      if (href !== current) {
        start();
      }
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, [pathname, searchParams, start]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 200ms' }}
    >
      <div
        className="h-full bg-primary shadow-[0_0_8px_rgba(30,64,175,0.4)]"
        style={{
          width: `${progress}%`,
          transition: progress === 0
            ? 'none'
            : progress === 100
            ? 'width 150ms ease-out'
            : 'width 400ms ease',
        }}
      />
    </div>
  );
}
