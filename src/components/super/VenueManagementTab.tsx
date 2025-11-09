"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVenues } from "@/lib/hooks";
import { VenueAdminPanel } from "./VenueAdminPanel";
import { CreateVenueForm } from "./CreateVenueForm";
import { ArrowLeft, Building2, Plus } from "lucide-react";
import type { Venue } from "@/types/db";

export function VenueManagementTab() {
  const { data: venues, loading, refetch } = useVenues();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Show create form
  if (showCreateForm) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setShowCreateForm(false)}>
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
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Venue
          </Button>
        </div>
        <Card className="p-12">
          <div className="text-center text-gray-500">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
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
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Venue
        </Button>
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
