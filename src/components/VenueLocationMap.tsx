"use client";

import { ExternalLink, MapPin } from "lucide-react";

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

  // Fallback: static address display when no API key is configured
  // Shows the address inline instead of navigating users away
  return (
    <div className={className}>
      <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
        {/* Static map placeholder */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-6 flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm font-medium text-gray-900 text-center">{venueName || fullAddress}</p>
          {venueName && (
            <p className="text-xs text-gray-600 text-center">{fullAddress}</p>
          )}
        </div>
        {/* Small secondary link */}
        <div className="px-4 py-2 bg-white border-t border-gray-200 flex justify-end">
          <a
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            View on Google Maps
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
