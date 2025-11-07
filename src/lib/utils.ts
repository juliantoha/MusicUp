import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date/time string in Pacific Time
 */
export function formatPacificTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Los_Angeles",
  });
}

/**
 * Format a date in Pacific Time
 */
export function formatPacificDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  });
}

/**
 * Format date and time range in Pacific Time
 */
export function formatPacificTimeRange(startsAt: string, endsAt: string): string {
  const startTime = formatPacificTime(startsAt);
  const endTime = formatPacificTime(endsAt);
  return `${startTime} - ${endTime} PT`;
}
