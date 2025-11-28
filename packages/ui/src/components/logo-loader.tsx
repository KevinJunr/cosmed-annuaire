"use client";

import { cn } from "../lib/utils";

type LoaderSpeed = "slow" | "normal" | "fast";
type LoaderSize = "sm" | "md" | "lg" | "xl";

interface LogoLoaderProps {
  speed?: LoaderSpeed;
  size?: LoaderSize;
  className?: string;
}

const sizeMap: Record<LoaderSize, string> = {
  sm: "w-12 h-12",
  md: "w-24 h-24",
  lg: "w-36 h-36",
  xl: "w-48 h-48",
};

const speedMap: Record<LoaderSpeed, string> = {
  slow: "7s",
  normal: "4.8s",
  fast: "3s",
};

export function LogoLoader({
  speed = "normal",
  size = "lg",
  className,
}: LogoLoaderProps) {
  const duration = speedMap[speed];

  return (
    <div className={cn(sizeMap[size], className)}>
      <svg
        viewBox="-30 -30 260 260"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <style>
          {`
            .logo-group {
              transform-origin: 100px 100px;
              animation: rotate-full ${duration} ease-in-out infinite;
            }

            @keyframes rotate-full {
              0%, 10% { transform: rotate(0deg); }
              12.5% { transform: rotate(90deg); }
              25%, 35% { transform: rotate(90deg); }
              37.5% { transform: rotate(180deg); }
              50%, 60% { transform: rotate(180deg); }
              62.5% { transform: rotate(270deg); }
              75%, 85% { transform: rotate(270deg); }
              87.5% { transform: rotate(360deg); }
              100% { transform: rotate(360deg); }
            }

            .c1 { animation: explode-tl ${duration} ease-in-out infinite; }
            .c2 { animation: explode-t ${duration} ease-in-out infinite; }
            .c3 { animation: explode-tr ${duration} ease-in-out infinite; }
            .c4 { animation: explode-l ${duration} ease-in-out infinite; }
            .c6 { animation: explode-r ${duration} ease-in-out infinite; }
            .c7 { animation: explode-bl ${duration} ease-in-out infinite; }
            .c8 { animation: explode-b ${duration} ease-in-out infinite; }
            .c9 { animation: explode-br ${duration} ease-in-out infinite; }

            @keyframes explode-tl {
              0%, 12.5% { transform: translate(0, 0); }
              18% { transform: translate(-18px, -18px); }
              25%, 37.5% { transform: translate(0, 0); }
              43% { transform: translate(-18px, -18px); }
              50%, 62.5% { transform: translate(0, 0); }
              68% { transform: translate(-18px, -18px); }
              75%, 87.5% { transform: translate(0, 0); }
              93% { transform: translate(-18px, -18px); }
              100% { transform: translate(0, 0); }
            }

            @keyframes explode-t {
              0%, 12.5% { transform: translate(0, 0); }
              18% { transform: translate(0, -22px); }
              25%, 37.5% { transform: translate(0, 0); }
              43% { transform: translate(0, -22px); }
              50%, 62.5% { transform: translate(0, 0); }
              68% { transform: translate(0, -22px); }
              75%, 87.5% { transform: translate(0, 0); }
              93% { transform: translate(0, -22px); }
              100% { transform: translate(0, 0); }
            }

            @keyframes explode-tr {
              0%, 12.5% { transform: translate(0, 0); }
              18% { transform: translate(18px, -18px); }
              25%, 37.5% { transform: translate(0, 0); }
              43% { transform: translate(18px, -18px); }
              50%, 62.5% { transform: translate(0, 0); }
              68% { transform: translate(18px, -18px); }
              75%, 87.5% { transform: translate(0, 0); }
              93% { transform: translate(18px, -18px); }
              100% { transform: translate(0, 0); }
            }

            @keyframes explode-l {
              0%, 12.5% { transform: translate(0, 0); }
              18% { transform: translate(-22px, 0); }
              25%, 37.5% { transform: translate(0, 0); }
              43% { transform: translate(-22px, 0); }
              50%, 62.5% { transform: translate(0, 0); }
              68% { transform: translate(-22px, 0); }
              75%, 87.5% { transform: translate(0, 0); }
              93% { transform: translate(-22px, 0); }
              100% { transform: translate(0, 0); }
            }

            @keyframes explode-r {
              0%, 12.5% { transform: translate(0, 0); }
              18% { transform: translate(22px, 0); }
              25%, 37.5% { transform: translate(0, 0); }
              43% { transform: translate(22px, 0); }
              50%, 62.5% { transform: translate(0, 0); }
              68% { transform: translate(22px, 0); }
              75%, 87.5% { transform: translate(0, 0); }
              93% { transform: translate(22px, 0); }
              100% { transform: translate(0, 0); }
            }

            @keyframes explode-bl {
              0%, 12.5% { transform: translate(0, 0); }
              18% { transform: translate(-18px, 18px); }
              25%, 37.5% { transform: translate(0, 0); }
              43% { transform: translate(-18px, 18px); }
              50%, 62.5% { transform: translate(0, 0); }
              68% { transform: translate(-18px, 18px); }
              75%, 87.5% { transform: translate(0, 0); }
              93% { transform: translate(-18px, 18px); }
              100% { transform: translate(0, 0); }
            }

            @keyframes explode-b {
              0%, 12.5% { transform: translate(0, 0); }
              18% { transform: translate(0, 22px); }
              25%, 37.5% { transform: translate(0, 0); }
              43% { transform: translate(0, 22px); }
              50%, 62.5% { transform: translate(0, 0); }
              68% { transform: translate(0, 22px); }
              75%, 87.5% { transform: translate(0, 0); }
              93% { transform: translate(0, 22px); }
              100% { transform: translate(0, 0); }
            }

            @keyframes explode-br {
              0%, 12.5% { transform: translate(0, 0); }
              18% { transform: translate(18px, 18px); }
              25%, 37.5% { transform: translate(0, 0); }
              43% { transform: translate(18px, 18px); }
              50%, 62.5% { transform: translate(0, 0); }
              68% { transform: translate(18px, 18px); }
              75%, 87.5% { transform: translate(0, 0); }
              93% { transform: translate(18px, 18px); }
              100% { transform: translate(0, 0); }
            }
          `}
        </style>
        <g className="logo-group">
          {/* Ligne du haut - .f .c .e */}
          <circle className="c1" cx="36.42" cy="40.64" r="26.66" style={{ fill: "var(--primary-600)" }} />
          <circle className="c2" cx="100" cy="40.64" r="26.66" style={{ fill: "var(--primary-700)" }} />
          <circle className="c3" cx="163.58" cy="40.64" r="26.66" style={{ fill: "var(--primary-900)" }} />

          {/* Ligne du milieu - .d .f .c */}
          <circle className="c4" cx="36.42" cy="100" r="26.66" style={{ fill: "var(--primary-500)" }} />
          <circle className="c5" cx="100" cy="100" r="26.66" style={{ fill: "var(--primary-600)" }} />
          <circle className="c6" cx="163.58" cy="100" r="26.66" style={{ fill: "var(--primary-700)" }} />

          {/* Ligne du bas - .b .d .f */}
          <circle className="c7" cx="36.42" cy="159.36" r="26.66" style={{ fill: "var(--primary-800)" }} />
          <circle className="c8" cx="100" cy="159.36" r="26.66" style={{ fill: "var(--primary-500)" }} />
          <circle className="c9" cx="163.58" cy="159.36" r="26.66" style={{ fill: "var(--primary-600)" }} />
        </g>
      </svg>
    </div>
  );
}
