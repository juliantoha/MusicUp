"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVenues } from "@/lib/hooks";
import { VenueAdminPanel } from "./VenueAdminPanel";
import { ArrowLeft, Building2 } from "lucide-react";
import type { Venue } from "@/types/db";

export function VenueManagementTab() {
  const { data: venues, loading } = useVenues();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  if (selectedVenue) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setSelectedVenue(null)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Venues
        </Button>
        <VenueAdminPanel venue={selectedVenue} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-gray-500">Loading venues...</p>
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center text-gray-500">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Venues</h3>
          <p className="text-sm">No venues have been created yet.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">All Venues</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select a venue to manage its administrators and permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {venues.map((venue) => (
          <Card
            key={venue.id}
            className="p-4 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
            onClick={() => setSelectedVenue(venue)}
          >
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-blue-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{venue.name}</h4>
                <p className="text-sm text-gray-600">
                  {venue.city}, {venue.state}
                </p>
                <p className="text-xs text-gray-500 mt-1">{venue.address}</p>
                {venue.contact_name && (
                  <p className="text-xs text-gray-500 mt-2">
                    Contact: {venue.contact_name}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
