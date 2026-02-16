"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVenues } from "@/lib/hooks";
import { VenueAdminPanel } from "./VenueAdminPanel";
import { CreateVenueForm } from "./CreateVenueForm";
import { VenueTypeBadge } from "@/components/ui/VenueTypeBadge";
import { ArrowLeft, Building2, Plus } from "lucide-react";
import type { VenueWithType } from "@/types/db";

export function VenueManagementTab() {
  const { data: venues, loading, refetch } = useVenues();
  const [selectedVenue, setSelectedVenue] = useState<VenueWithType | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Show create form
  if (showCreateForm) {
    return (
      <div className="space-y-4">
        <Button variant="outline" className="border-gray-200" onClick={() => setShowCreateForm(false)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Venues
        </Button>
        <CreateVenueForm
          onSuccess={() => {
            setShowCreateForm(false);
            refetch();
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    );
  }

  // Show venue details
  if (selectedVenue) {
    return (
      <div className="space-y-4">
        <Button variant="outline" className="border-gray-200" onClick={() => setSelectedVenue(null)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Venues
        </Button>
        <VenueAdminPanel venue={selectedVenue} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 skeleton rounded-lg" />
        <div className="h-4 w-96 skeleton rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-40 skeleton rounded-xl" />
          <div className="h-40 skeleton rounded-xl" />
          <div className="h-40 skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button className="shadow-md hover:shadow-lg transition-all" onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Venue
          </Button>
        </div>
        <Card className="p-12 border border-gray-100">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Venues</h3>
            <p className="text-sm mb-4">No venues have been created yet.</p>
            <Button onClick={() => setShowCreateForm(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Venue
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">All Venues</h3>
          <p className="text-sm text-gray-600">
            Select a venue to manage its administrators and permissions.
          </p>
        </div>
        <Button className="shadow-md hover:shadow-lg transition-all" onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Venue
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {venues.map((venue) => (
          <Card
            key={venue.id}
            className="p-4 cursor-pointer card-hover hover:border-blue-500 hover:shadow-md transition-all border border-gray-100"
            onClick={() => setSelectedVenue(venue)}
          >
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-blue-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{venue.name}</h4>
                {venue.venue_type && (
                  <div className="mb-2">
                    <VenueTypeBadge venueType={venue.venue_type} />
                  </div>
                )}
                <p className="text-sm text-gray-600">
                  {venue.city}, {venue.state}
                </p>
                <p className="text-xs text-gray-500 mt-1">{venue.address}</p>
                {venue.venue_contact_name && (
                  <p className="text-xs text-gray-500 mt-2">
                    Contact: {venue.venue_contact_name}
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
