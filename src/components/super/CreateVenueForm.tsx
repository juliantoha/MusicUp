"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createVenue } from "@/lib/venues/actions";
import { useVenueTypes } from "@/lib/hooks";
import { Building2, Loader2, Plus } from "lucide-react";
import type { VenueInsert } from "@/types/db";

interface CreateVenueFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateVenueForm({ onSuccess, onCancel }: CreateVenueFormProps) {
  const { data: venueTypes, loading: loadingVenueTypes } = useVenueTypes();
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<VenueInsert>>({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    contact_email: "",
    notes: "",
    is_active: true,
    venue_type_id: null,
    venue_contact_name: "",
    venue_contact_email: "",
    venue_contact_phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.zip) {
      toast.error("Please fill in all required fields");
      return;
    }

    setCreating(true);

    try {
      const result = await createVenue(formData as VenueInsert);

      if ("error" in result && result.error) {
        toast.error(result.error);
      } else if ("success" in result && result.success) {
        toast.success(`Venue "${result.venue?.name}" created successfully`);
        // Reset form
        setFormData({
          name: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          contact_email: "",
          notes: "",
          is_active: true,
          venue_type_id: null,
          venue_contact_name: "",
          venue_contact_email: "",
          venue_contact_phone: "",
        });
        onSuccess?.();
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setCreating(false);
    }
  };

  const handleChange = (field: keyof VenueInsert, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-green-600" />
          <CardTitle>Create New Venue</CardTitle>
        </div>
        <CardDescription>
          Add a new venue to the system. Include venue contact information for coordination.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Basic Information</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Venue Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Ivy Park Pleasanton"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={creating}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue_type_id">Venue Type</Label>
              <Select
                value={formData.venue_type_id || ""}
                onValueChange={(value) => handleChange("venue_type_id", value || null)}
                disabled={creating || loadingVenueTypes}
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
                Helps match the venue with appropriate series (e.g., Empathy Concerts for senior living)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                placeholder="e.g., 123 Main St"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                disabled={creating}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="e.g., Pleasanton"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  disabled={creating}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  placeholder="CA"
                  maxLength={2}
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value.toUpperCase())}
                  disabled={creating}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code *</Label>
              <Input
                id="zip"
                placeholder="94588"
                value={formData.zip}
                onChange={(e) => handleChange("zip", e.target.value)}
                disabled={creating}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information about the venue..."
                value={formData.notes || ""}
                onChange={(e) => handleChange("notes", e.target.value)}
                disabled={creating}
                rows={3}
              />
            </div>
          </div>

          {/* Venue Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
              Venue Contact Person
            </h3>
            <p className="text-xs text-gray-500">
              The person at the venue who confirms logistics and receives concert confirmations.
            </p>

            <div className="space-y-2">
              <Label htmlFor="venue_contact_name">Contact Name</Label>
              <Input
                id="venue_contact_name"
                placeholder="e.g., John Smith"
                value={formData.venue_contact_name || ""}
                onChange={(e) => handleChange("venue_contact_name", e.target.value)}
                disabled={creating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue_contact_email">Contact Email</Label>
              <Input
                id="venue_contact_email"
                type="email"
                placeholder="e.g., contact@venue.com"
                value={formData.venue_contact_email || ""}
                onChange={(e) => handleChange("venue_contact_email", e.target.value)}
                disabled={creating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue_contact_phone">Contact Phone</Label>
              <Input
                id="venue_contact_phone"
                type="tel"
                placeholder="e.g., (925) 555-1234"
                value={formData.venue_contact_phone || ""}
                onChange={(e) => handleChange("venue_contact_phone", e.target.value)}
                disabled={creating}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={creating}
            >
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Venue...
                </>
              ) : (
                <>
                  <Building2 className="mr-2 h-4 w-4" />
                  Create Venue
                </>
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={creating}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
