"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Building2, Save, Loader2, Tag } from "lucide-react";
import { getMyManagedVenues, updateVenue } from "@/lib/venues/actions";
import { useVenueTypes } from "@/lib/hooks";
import type { Venue } from "@/types/db";

export function VenueContactTab() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    setLoading(true);
    const result = await getMyManagedVenues();
    if (result.error) {
      toast.error(result.error);
    } else if (result.venues) {
      setVenues(result.venues);
      // Auto-select first venue if available
      if (result.venues.length > 0 && !selectedVenue) {
        setSelectedVenue(result.venues[0]);
      }
    }
    setLoading(false);
  };

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
          <h3 className="text-lg font-semibold mb-2">No Venues Assigned</h3>
          <p className="text-sm">
            You don't have any venues assigned yet. Contact a super admin to get access.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Venue Contact Settings</h3>
        <p className="text-sm text-gray-600 mb-4">
          Manage contact information for venues you administer. This information is used for
          logistics confirmations and event coordination.
        </p>
      </div>

      {/* Venue Selector */}
      {venues.length > 1 && (
        <Card className="p-4">
          <Label className="text-sm font-medium mb-2 block">Select Venue</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {venues.map((venue) => (
              <Button
                key={venue.id}
                variant={selectedVenue?.id === venue.id ? "default" : "outline"}
                className="justify-start"
                onClick={() => setSelectedVenue(venue)}
              >
                <Building2 className="w-4 h-4 mr-2" />
                {venue.name}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Venue Contact Editor */}
      {selectedVenue && (
        <VenueContactEditor
          venue={selectedVenue}
          onUpdate={() => {
            loadVenues();
            toast.success("Venue contact updated successfully");
          }}
        />
      )}
    </div>
  );
}

interface VenueContactEditorProps {
  venue: Venue;
  onUpdate: () => void;
}

function VenueContactEditor({ venue, onUpdate }: VenueContactEditorProps) {
  const { data: venueTypes, loading: loadingVenueTypes } = useVenueTypes();
  const [formData, setFormData] = useState({
    venue_type_id: venue.venue_type_id || null,
    venue_contact_name: venue.venue_contact_name || "",
    venue_contact_email: venue.venue_contact_email || "",
    venue_contact_phone: venue.venue_contact_phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Reset form when venue changes
  useEffect(() => {
    setFormData({
      venue_type_id: venue.venue_type_id || null,
      venue_contact_name: venue.venue_contact_name || "",
      venue_contact_email: venue.venue_contact_email || "",
      venue_contact_phone: venue.venue_contact_phone || "",
    });
    setHasChanges(false);
  }, [venue.id]);

  const handleChange = (field: string, value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updateVenue(venue.id, formData);

    if ("error" in result && result.error) {
      toast.error(result.error);
    } else {
      setHasChanges(false);
      onUpdate();
    }
    setSaving(false);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Venue Info Header */}
        <div className="border-b pb-4">
          <h4 className="text-base font-semibold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-600" />
            {venue.name}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {venue.address}, {venue.city}, {venue.state} {venue.zip}
          </p>
        </div>

        {/* Venue Type Selector */}
        <div className="space-y-2">
          <Label htmlFor="venue_type_id" className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Venue Type
          </Label>
          <Select
            value={formData.venue_type_id || ""}
            onValueChange={(value) => handleChange("venue_type_id", value || null)}
            disabled={loadingVenueTypes || saving}
          >
            <SelectTrigger id="venue_type_id">
              <SelectValue placeholder="Select a venue type..." />
            </SelectTrigger>
            <SelectContent>
              {venueTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Helps match this venue with appropriate concert series (e.g., Empathy Concerts for senior living)
          </p>
        </div>

        {/* Contact Form */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="venue_contact_name">
                Venue Contact Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="venue_contact_name"
                type="text"
                placeholder="John Smith"
                value={formData.venue_contact_name || ""}
                onChange={(e) => handleChange("venue_contact_name", e.target.value)}
              />
              <p className="text-xs text-gray-500">
                The person at the venue who confirms logistics
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue_contact_email">
                Venue Contact Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="venue_contact_email"
                type="email"
                placeholder="contact@venue.com"
                value={formData.venue_contact_email || ""}
                onChange={(e) => handleChange("venue_contact_email", e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Used for event confirmations and logistics
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue_contact_phone">Venue Contact Phone</Label>
            <Input
              id="venue_contact_phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.venue_contact_phone || ""}
              onChange={(e) => handleChange("venue_contact_phone", e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Optional: Phone number for urgent coordination
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-xs text-blue-800">
            <strong>Privacy:</strong> Venue contact information is only visible to administrators
            and is not shared with performers or public users.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => {
              setFormData({
                venue_type_id: venue.venue_type_id || null,
                venue_contact_name: venue.venue_contact_name || "",
                venue_contact_email: venue.venue_contact_email || "",
                venue_contact_phone: venue.venue_contact_phone || "",
              });
              setHasChanges(false);
            }}
            disabled={!hasChanges || saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
