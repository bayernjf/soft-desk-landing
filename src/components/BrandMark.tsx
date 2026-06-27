import { cn } from '@/lib/utils';

interface BrandMarkProps {
  className?: string;
  gradientId?: string;
}

export function BrandMark({ className, gradientId = 'softdesk-brand' }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-8 h-8', className)}
    >
      <rect width="512" height="512" rx="115" fill={`url(#${gradientId})`} />
      <path
        d="M156 136 H266 a120 120 0 0 1 0 240 H156 Z"
        fill="none"
        stroke="#ffffff"
        strokeWidth="40"
        strokeLinejoin="round"
      />
      <path d="M214 206 L300 256 L214 306 Z" fill="#ffffff" />
      <rect x="150" y="392" width="212" height="20" rx="10" fill="#ffffff" fillOpacity="0.9" />
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
}
