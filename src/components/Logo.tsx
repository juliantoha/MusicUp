import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  animate?: boolean;
}

export function Logo({ className, animate = false }: LogoProps) {
  return (
    <svg
      width="1000"
      height="1000"
      viewBox="0 0 1000 1000"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      {/* Left bar */}
      <rect
        x="160"
        y="200"
        width="120"
        height="600"
        rx="24"
        ry="24"
        fill="currentColor"
        className={animate ? "animate-logo-bar-1" : ""}
      />

      {/* Middle bar */}
      <rect
        x="400"
        y="429"
        width="120"
        height="371"
        rx="24"
        ry="24"
        fill="currentColor"
        className={animate ? "animate-logo-bar-2" : ""}
      />

      {/* Right bar */}
      <rect
        x="640"
        y="200"
        width="120"
        height="600"
        rx="24"
        ry="24"
        fill="currentColor"
        className={animate ? "animate-logo-bar-3" : ""}
      />
    </svg>
  );
}
