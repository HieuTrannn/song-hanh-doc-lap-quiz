"use client";

interface TopStripProps {
  roomCode?: string;
  quizTitle?: string;
  playerCount?: number;
  currentSlide?: number;
  totalSlides?: number;
  onPause?: () => void;
  onSkip?: () => void;
  onSettings?: () => void;
  onFullscreen?: () => void;
}

export function TopStrip({
  roomCode,
  quizTitle,
  playerCount = 0,
  currentSlide,
  totalSlides,
  onPause,
  onSkip,
  onSettings,
  onFullscreen,
}: TopStripProps) {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-black/20 backdrop-blur-sm z-20">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <span
          className="text-xl font-bold tracking-tight flex items-center gap-1.5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="text-accent-pink">Song</span>
          <span className="text-accent-yellow">Hành</span>
          <span className="text-accent-lime">Độc</span>
          <span className="text-accent-coral">Lập</span>
        </span>

        {roomCode && (
          <span className="text-text-cream font-bold text-sm">
            PIN {roomCode.slice(0, 3)} {roomCode.slice(3)}
          </span>
        )}

        {quizTitle && (
          <span className="text-text-soft-cream text-sm font-semibold hidden md:inline">
            {quizTitle}
          </span>
        )}

        <span className="text-text-cream text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
          {playerCount}
        </span>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {currentSlide !== undefined && totalSlides !== undefined && (
          <span className="text-text-cream text-sm font-bold">
            Slide {currentSlide}/{totalSlides}
          </span>
        )}

        {onPause && (
          <button
            onClick={onPause}
            className="text-text-cream hover:text-white transition-colors p-1"
            title="Pause"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
            </svg>
          </button>
        )}

        {onSkip && (
          <button
            onClick={onSkip}
            className="text-text-cream hover:text-white transition-colors p-1"
            title="Skip"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4l8 6-8 6V4zm9 0h3v12h-3V4z" />
            </svg>
          </button>
        )}

        {onFullscreen && (
          <button
            onClick={onFullscreen}
            className="text-text-cream hover:text-white transition-colors p-1"
            title="Fullscreen"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
