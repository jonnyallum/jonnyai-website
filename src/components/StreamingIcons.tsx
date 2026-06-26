/**
 * StreamingIcons — brand-accurate streaming platform glyphs + a reusable
 * "streaming pill" button. Shared by the /music artist page and the About
 * page so the Spotify / Apple Music / YouTube marks stay consistent.
 */

export function SpotifyIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.66.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.18-1.021.6-1.141 4.32-1.32 9.78-.66 13.5 1.62.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.6-1.559.3z" />
    </svg>
  );
}

export function AppleMusicIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.997 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043C20.74.336 19.71.075 18.64.018c-.317-.017-.633-.017-.95-.017H6.31c-.317 0-.633 0-.95.017C4.29.075 3.26.336 2.423.891 1.305 1.624.56 2.624.243 3.934A9.23 9.23 0 0 0 .003 6.124c-.003.32-.003.64-.003.96v9.832c0 .32 0 .64.003.96.013.736.06 1.476.24 2.19.317 1.31 1.062 2.31 2.18 3.043.837.555 1.867.816 2.937.873.317.017.633.017.95.017h11.38c.317 0 .633 0 .95-.017 1.07-.057 2.1-.318 2.937-.873 1.118-.733 1.863-1.733 2.18-3.043.18-.714.227-1.454.24-2.19.003-.32.003-.64.003-.96V7.084c0-.32 0-.64-.003-.96zM17.4 5.49v9.05c0 .42-.038.84-.286 1.2-.394.575-.96.86-1.65.91-.13.01-.26.02-.39.02-1.01 0-1.83-.69-1.99-1.66-.13-.81.25-1.62.99-2.02.29-.16.61-.25.94-.31.36-.07.72-.13 1.08-.2.25-.05.4-.2.41-.45V8.16c0-.2-.09-.26-.28-.22l-5.13 1.04c-.22.05-.3.15-.3.38v6.36c0 .43-.04.85-.3 1.21-.39.55-.95.83-1.62.88-.13.01-.26.02-.39.02-1.01 0-1.84-.69-2-1.66-.13-.82.26-1.63 1-2.03.29-.16.61-.24.93-.31.36-.07.73-.13 1.09-.2.25-.05.4-.2.4-.45V6.78c0-.36.16-.58.51-.66l6.27-1.27c.05-.01.11-.02.16-.02.22 0 .35.15.35.39z" />
    </svg>
  );
}

export function YouTubeIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
    </svg>
  );
}

export type Platform = 'spotify' | 'apple' | 'youtube';

const PLATFORM_META: Record<
  Platform,
  { label: string; color: string; text: string; Icon: (p: { className?: string }) => React.ReactElement }
> = {
  spotify: { label: 'Spotify', color: '#1DB954', text: '#000', Icon: SpotifyIcon },
  apple: { label: 'Apple Music', color: '#FA243C', text: '#fff', Icon: AppleMusicIcon },
  youtube: { label: 'YouTube', color: '#FF0000', text: '#fff', Icon: YouTubeIcon },
};

/**
 * StreamingPill — a filled, brand-coloured CTA button for a platform.
 * When `href` is empty the pill renders as a disabled "coming soon" chip.
 */
export function StreamingPill({
  platform,
  href,
  sublabel,
}: {
  platform: Platform;
  href?: string;
  sublabel?: string;
}) {
  const { label, color, text, Icon } = PLATFORM_META[platform];
  const live = !!href;

  const inner = (
    <>
      <Icon className="w-5 h-5 shrink-0" />
      <span className="flex flex-col items-start leading-none">
        <span className="text-sm font-bold tracking-wide">{label}</span>
        {sublabel && (
          <span className="text-[10px] font-medium uppercase tracking-[0.15em] opacity-70 mt-0.5">
            {sublabel}
          </span>
        )}
      </span>
    </>
  );

  if (!live) {
    return (
      <span
        className="inline-flex items-center gap-3 rounded-full px-5 py-3 cursor-default select-none"
        style={{
          color: 'rgba(255,255,255,0.45)',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        aria-disabled="true"
      >
        <Icon className="w-5 h-5 shrink-0" />
        <span className="flex flex-col items-start leading-none">
          <span className="text-sm font-bold tracking-wide">{label}</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.15em] opacity-80 mt-0.5">
            Coming soon
          </span>
        </span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 rounded-full px-5 py-3 transition-all duration-300 hover:scale-[1.04] active:scale-[0.98]"
      style={{ background: color, color: text, boxShadow: `0 8px 30px ${color}40` }}
    >
      {inner}
    </a>
  );
}
