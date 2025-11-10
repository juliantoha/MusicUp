import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  animate?: boolean;
}

export function Logo({ className, animate = false }: LogoProps) {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      {/* Left bar */}
      <rect
        x="14"
        y="20"
        width="16"
        height="60"
        rx="4"
        ry="4"
        fill="currentColor"
        className={animate ? "animate-logo-bar-1" : ""}
      />

      {/* Middle bar */}
      <rect
        x="42"
        y="32"
        width="16"
        height="48"
        rx="4"
        ry="4"
        fill="currentColor"
        className={animate ? "animate-logo-bar-2" : ""}
      />

      {/* Right bar */}
      <rect
        x="70"
        y="20"
        width="16"
        height="60"
        rx="4"
        ry="4"
        fill="currentColor"
        className={animate ? "animate-logo-bar-3" : ""}
      />
    </svg>
  );
}
