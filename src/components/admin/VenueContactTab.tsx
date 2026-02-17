"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
import { Building2, Save, Loader2, Tag, Camera, Upload, MapPin, X, FileText } from "lucide-react";
import { getMyManagedVenues, updateVenue, uploadVenuePhoto } from "@/lib/venues/actions";
import { getUnsignedWaivers } from "@/lib/waivers/actions";
import { useVenueTypes } from "@/lib/hooks";
import { VenueLocationMap } from "@/components/VenueLocationMap";
import { WaiverSigningPanel } from "@/components/WaiverSigningPanel";
import type { Venue, VenueWaiver } from "@/types/db";

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
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-52 skeleton rounded-lg" />
          <div className="h-4 w-80 skeleton rounded-lg" />
        </div>
        <div className="h-48 skeleton rounded-xl" />
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Venues Assigned</h3>
        <p className="text-sm text-gray-500">
          You don't have any venues assigned yet. Contact a super admin to get access.
        </p>
      </div>
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
                className={
                  selectedVenue?.id === venue.id
                    ? "justify-start card-hover"
                    : "justify-start card-hover border-gray-200"
                }
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
  const [uploadingInterior, setUploadingInterior] = useState(false);
  const [uploadingExterior, setUploadingExterior] = useState(false);
  const [interiorPhotoUrl, setInteriorPhotoUrl] = useState(venue.interior_photo_url || "");
  const [exteriorPhotoUrl, setExteriorPhotoUrl] = useState(venue.exterior_photo_url || "");
  const [latitude, setLatitude] = useState(venue.latitude?.toString() || "");
  const [longitude, setLongitude] = useState(venue.longitude?.toString() || "");
  const [savingLocation, setSavingLocation] = useState(false);
  const [unsignedWaivers, setUnsignedWaivers] = useState<VenueWaiver[]>([]);
  const [loadingWaivers, setLoadingWaivers] = useState(true);
  const interiorInputRef = useRef<HTMLInputElement>(null);
  const exteriorInputRef = useRef<HTMLInputElement>(null);

  // Reset form when venue changes
  useEffect(() => {
    setFormData({
      venue_type_id: venue.venue_type_id || null,
      venue_contact_name: venue.venue_contact_name || "",
      venue_contact_email: venue.venue_contact_email || "",
      venue_contact_phone: venue.venue_contact_phone || "",
    });
    setInteriorPhotoUrl(venue.interior_photo_url || "");
    setExteriorPhotoUrl(venue.exterior_photo_url || "");
    setLatitude(venue.latitude?.toString() || "");
    setLongitude(venue.longitude?.toString() || "");
    setHasChanges(false);
    loadUnsignedWaivers();
  }, [venue.id, venue.interior_photo_url, venue.exterior_photo_url, venue.latitude, venue.longitude]);

  const loadUnsignedWaivers = async () => {
    setLoadingWaivers(true);
    const result = await getUnsignedWaivers(venue.id);
    if ("unsignedWaivers" in result) {
      setUnsignedWaivers(result.unsignedWaivers);
    }
    setLoadingWaivers(false);
  };

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
    <Card className="p-6 border border-gray-100">
      <div className="space-y-6">
        {/* Venue Info Header */}
        <div className="border-b pb-4">
          <h4 className="text-base font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            {venue.name}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {venue.address}, {venue.city}, {venue.state} {venue.zip}
          </p>
        </div>

        {/* Venue Waivers - Show if there are unsigned waivers */}
        {!loadingWaivers && unsignedWaivers.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Required Waivers
            </Label>
            <WaiverSigningPanel
              waivers={unsignedWaivers}
              venueName={venue.name}
              onAllSigned={() => loadUnsignedWaivers()}
            />
          </div>
        )}

        {/* Venue Type Selector */}
        <div className="space-y-2">
          <Label htmlFor="venue_type_id" className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Venue Type
          </Label>
          <Select
            value={formData.venue_type_id || ""}
            onValueChange={(value) => handleChange("venue_type_id", value || null)}
            disabled={loadingVenueTypes || saving}
          >
            <SelectTrigger id="venue_type_id" className="h-10 border-gray-200">
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
          <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Contact Information
          </Label>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="venue_contact_name">
                Venue Contact Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="venue_contact_name"
                type="text"
                placeholder="John Smith"
                className="h-10 border-gray-200 bg-white focus:border-[#2563EB] transition-colors"
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
                className="h-10 border-gray-200 bg-white focus:border-[#2563EB] transition-colors"
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
              className="h-10 border-gray-200 bg-white focus:border-[#2563EB] transition-colors"
              value={formData.venue_contact_phone || ""}
              onChange={(e) => handleChange("venue_contact_phone", e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Optional: Phone number for urgent coordination
            </p>
          </div>
        </div>

        {/* Venue Photos */}
        <div className="space-y-4">
          <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Venue Photos
          </Label>
          <p className="text-xs text-gray-500 -mt-2">
            Upload photos of the venue interior and exterior. These are shown to performers when booking.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Exterior Photo */}
            <div className="space-y-2">
              <Label className="text-sm">Exterior Photo</Label>
              <input
                ref={exteriorInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadingExterior(true);
                  const fd = new FormData();
                  fd.append("venue_id", venue.id);
                  fd.append("photo_type", "exterior");
                  fd.append("file", file);
                  const result = await uploadVenuePhoto(fd);
                  if ("error" in result && result.error) {
                    toast.error(result.error);
                  } else if ("url" in result && result.url) {
                    setExteriorPhotoUrl(result.url);
                    toast.success("Exterior photo uploaded");
                    onUpdate();
                  }
                  setUploadingExterior(false);
                  if (exteriorInputRef.current) exteriorInputRef.current.value = "";
                }}
              />
              {exteriorPhotoUrl ? (
                <div className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-[4/3]">
                  <Image
                    src={exteriorPhotoUrl}
                    alt="Venue exterior"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => exteriorInputRef.current?.click()}
                      disabled={uploadingExterior}
                    >
                      {uploadingExterior ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Upload className="w-4 h-4 mr-1" />}
                      Replace
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => exteriorInputRef.current?.click()}
                  disabled={uploadingExterior}
                  className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors flex flex-col items-center justify-center gap-2"
                >
                  {uploadingExterior ? (
                    <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-300" />
                      <span className="text-xs text-gray-500">Upload exterior photo</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Interior Photo */}
            <div className="space-y-2">
              <Label className="text-sm">Interior Photo</Label>
              <input
                ref={interiorInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadingInterior(true);
                  const fd = new FormData();
                  fd.append("venue_id", venue.id);
                  fd.append("photo_type", "interior");
                  fd.append("file", file);
                  const result = await uploadVenuePhoto(fd);
                  if ("error" in result && result.error) {
                    toast.error(result.error);
                  } else if ("url" in result && result.url) {
                    setInteriorPhotoUrl(result.url);
                    toast.success("Interior photo uploaded");
                    onUpdate();
                  }
                  setUploadingInterior(false);
                  if (interiorInputRef.current) interiorInputRef.current.value = "";
                }}
              />
              {interiorPhotoUrl ? (
                <div className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-[4/3]">
                  <Image
                    src={interiorPhotoUrl}
                    alt="Venue interior"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => interiorInputRef.current?.click()}
                      disabled={uploadingInterior}
                    >
                      {uploadingInterior ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Upload className="w-4 h-4 mr-1" />}
                      Replace
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => interiorInputRef.current?.click()}
                  disabled={uploadingInterior}
                  className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors flex flex-col items-center justify-center gap-2"
                >
                  {uploadingInterior ? (
                    <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-300" />
                      <span className="text-xs text-gray-500">Upload interior photo</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Venue Location */}
        <div className="space-y-4">
          <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </Label>
          <p className="text-xs text-gray-500 -mt-2">
            Optionally add coordinates for a precise map pin. Leave blank to use the address.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="e.g. 37.7749"
                className="h-10 border-gray-200 bg-white focus:border-[#2563EB] transition-colors"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="e.g. -122.4194"
                className="h-10 border-gray-200 bg-white focus:border-[#2563EB] transition-colors"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={savingLocation}
            onClick={async () => {
              setSavingLocation(true);
              const lat = latitude ? parseFloat(latitude) : null;
              const lng = longitude ? parseFloat(longitude) : null;
              if (latitude && (isNaN(lat!) || lat! < -90 || lat! > 90)) {
                toast.error("Latitude must be between -90 and 90");
                setSavingLocation(false);
                return;
              }
              if (longitude && (isNaN(lng!) || lng! < -180 || lng! > 180)) {
                toast.error("Longitude must be between -180 and 180");
                setSavingLocation(false);
                return;
              }
              const result = await updateVenue(venue.id, { latitude: lat, longitude: lng });
              if ("error" in result && result.error) {
                toast.error(result.error);
              } else {
                toast.success("Location updated");
                onUpdate();
              }
              setSavingLocation(false);
            }}
          >
            {savingLocation ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
            Save Location
          </Button>

          {/* Map Preview */}
          <VenueLocationMap
            address={venue.address}
            city={venue.city}
            state={venue.state}
            zip={venue.zip}
            latitude={latitude ? parseFloat(latitude) : venue.latitude}
            longitude={longitude ? parseFloat(longitude) : venue.longitude}
            venueName={venue.name}
          />
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4">
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
