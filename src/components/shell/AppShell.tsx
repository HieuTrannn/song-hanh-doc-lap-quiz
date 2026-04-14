"use client";

import { SLIDE_THEMES } from "@/lib/types";

// Decorative shape SVGs
const shapes = {
  star: (
    <svg viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 5 L61 37 L95 37 L68 58 L79 91 L50 71 L21 91 L32 58 L5 37 L39 37 Z" />
    </svg>
  ),
  puzzle: (
    <svg viewBox="0 0 100 100" fill="currentColor">
      <path d="M25 10 H45 C45 10 50 0 55 10 H75 V30 C75 30 85 35 75 40 V60 H55 C55 60 50 70 45 60 H25 V40 C25 40 15 35 25 30 Z" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 10 C30 10 15 30 15 50 C15 70 30 90 50 90 C35 80 30 65 30 50 C30 35 35 20 50 10 Z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 100 100" fill="currentColor">
      <rect x="10" y="10" width="80" height="80" rx="15" opacity="0.5" />
      <path d="M30 55 L45 70 L75 35" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  brain: (
    <svg viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 85 C50 85 25 75 20 55 C15 35 25 20 40 15 C45 5 55 5 60 15 C75 20 85 35 80 55 C75 75 50 85 50 85 Z M50 25 C50 25 45 35 45 55 M50 25 C50 25 55 35 55 55 M30 45 C30 45 50 50 70 45" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 10 L55 40 L85 50 L55 60 L50 90 L45 60 L15 50 L45 40 Z" />
    </svg>
  ),
};

type ShapeKey = keyof typeof shapes;
const shapeKeys: ShapeKey[] = ["star", "puzzle", "moon", "check", "brain", "sparkle"];

// Generate random positions for decorative shapes
function generateDecoPositions(seed: number, count: number = 6) {
  const positions: Array<{
    x: number;
    y: number;
    size: number;
    rotation: number;
    shape: ShapeKey;
    delay: number;
  }> = [];

  // Simple seeded random
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };

  for (let i = 0; i < count; i++) {
    positions.push({
      x: rand() * 90 + 5,
      y: rand() * 85 + 5,
      size: rand() * 80 + 60,
      rotation: rand() * 360,
      shape: shapeKeys[Math.floor(rand() * shapeKeys.length)],
      delay: rand() * 3,
    });
  }

  return positions;
}

interface DecorativeShapesProps {
  themeIndex?: number;
  seed?: number;
}

export function DecorativeShapes({
  themeIndex = 0,
  seed = 42,
}: DecorativeShapesProps) {
  const positions = generateDecoPositions(seed + themeIndex * 1000, 7);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {positions.map((pos, i) => (
        <div
          key={i}
          className="deco-shape animate-float"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            width: `${pos.size}px`,
            height: `${pos.size}px`,
            transform: `rotate(${pos.rotation}deg)`,
            animationDelay: `${pos.delay}s`,
            animationDuration: `${6 + pos.delay}s`,
          }}
        >
          {shapes[pos.shape]}
        </div>
      ))}
    </div>
  );
}

interface AppShellProps {
  children: React.ReactNode;
  bg?: string;
  themeIndex?: number;
  showDecorations?: boolean;
}

export function AppShell({
  children,
  bg,
  themeIndex = 0,
  showDecorations = true,
}: AppShellProps) {
  const theme = SLIDE_THEMES[themeIndex % SLIDE_THEMES.length];
  const overlayColor = bg || theme.bg;

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ backgroundColor: `${overlayColor}cc` }}
    >
      {showDecorations && (
        <DecorativeShapes themeIndex={themeIndex} />
      )}
      <div className="relative z-10 flex flex-col flex-1">{children}</div>
    </div>
  );
}
