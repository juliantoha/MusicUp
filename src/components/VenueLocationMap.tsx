"use client";

import { ExternalLink } from "lucide-react";

interface VenueLocationMapProps {
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude?: number | null;
  longitude?: number | null;
  venueName?: string;
  className?: string;
}

export function VenueLocationMap({
  address,
  city,
  state,
  zip,
  latitude,
  longitude,
  venueName,
  className = "",
}: VenueLocationMapProps) {
  const fullAddress = `${address}, ${city}, ${state} ${zip}`;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Build the query - prefer lat/lng if available, fall back to address
  const query =
    latitude && longitude
      ? `${latitude},${longitude}`
      : encodeURIComponent(fullAddress);

  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    venueName ? `${venueName}, ${fullAddress}` : fullAddress
  )}`;

  if (apiKey) {
    // Use official Google Maps Embed API
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}`;

    return (
      <div className={className}>
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
          <iframe
            src={embedUrl}
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map showing ${venueName || fullAddress}`}
          />
          <a
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-xs text-gray-600 hover:text-[#2563EB] px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1 transition-colors"
          >
            Open in Google Maps
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // Fallback: static map link when no API key is configured
  return (
    <div className={className}>
      <a
        href={googleMapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-colors group"
      >
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
          <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{fullAddress}</p>
          <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
            View on Google Maps
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
      </a>
    </div>
  );
}
