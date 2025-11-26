import { cn } from "@workspace/ui/lib/utils"

interface FlagProps {
  className?: string
}

export function FlagFR({ className }: FlagProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3 2"
      className={cn("h-4 w-5 rounded-sm", className)}
    >
      <rect width="3" height="2" fill="#ED2939" />
      <rect width="2" height="2" fill="#fff" />
      <rect width="1" height="2" fill="#002395" />
    </svg>
  )
}

export function FlagGB({ className }: FlagProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 30"
      className={cn("h-4 w-5 rounded-sm", className)}
    >
      <clipPath id="t">
        <path d="M30,15h30v15zv15H0zH0V0zV0h30z" />
      </clipPath>
      <path d="M0,0v30h60V0z" fill="#00247d" />
      <path d="M0,0L60,30M60,0L0,30" stroke="#fff" strokeWidth="6" />
      <path
        d="M0,0L60,30M60,0L0,30"
        clipPath="url(#t)"
        stroke="#cf142b"
        strokeWidth="4"
      />
      <path d="M30,0v30M0,15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0v30M0,15h60" stroke="#cf142b" strokeWidth="6" />
    </svg>
  )
}

export function FlagCN({ className }: FlagProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 20"
      className={cn("h-4 w-5 rounded-sm", className)}
    >
      <rect width="30" height="20" fill="#de2910" />
      <g fill="#ffde00">
        <polygon points="5,4 5.9,6.8 3,5.1 7,5.1 4.1,6.8" />
        <polygon points="10,1 10.3,2.2 9.1,1.5 10.9,1.5 9.7,2.2" />
        <polygon points="12,3 11.7,4.2 11,3.3 12.4,3.9 11.1,4" />
        <polygon points="12,6 11.4,7 11.1,5.9 12.3,6.7 11,6.6" />
        <polygon points="10,8 10.1,9.2 9.2,8.4 10.6,8.7 9.4,9.2" />
      </g>
    </svg>
  )
}

export function FlagSA({ className }: FlagProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 20"
      className={cn("h-4 w-5 rounded-sm", className)}
    >
      <rect width="30" height="20" fill="#006C35" />
      <g fill="#fff">
        <text
          x="15"
          y="10"
          fontSize="5"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Arial"
        >
          ☪
        </text>
      </g>
    </svg>
  )
}

export function FlagES({ className }: FlagProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 20"
      className={cn("h-4 w-5 rounded-sm", className)}
    >
      <rect width="30" height="20" fill="#c60b1e" />
      <rect width="30" height="10" y="5" fill="#ffc400" />
    </svg>
  )
}

export const flags = {
  fr: FlagFR,
  en: FlagGB,
  zh: FlagCN,
  ar: FlagSA,
  es: FlagES,
} as const
