"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSeries, useVenueTypes } from "@/lib/hooks";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import type { Series, VenueType } from "@/types/db";

interface SeriesVenueTypeMapping {
  series_id: string;
  venue_type_id: string;
}

export function SeriesVenueTypeMappingsTab() {
  const { data: series, loading: seriesLoading } = useSeries();
  const { data: venueTypes, loading: venueTypesLoading } = useVenueTypes();
  const [mappings, setMappings] = useState<SeriesVenueTypeMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch existing mappings
  useEffect(() => {
    async function fetchMappings() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("series_venue_types")
        .select("series_id, venue_type_id");

      if (error) {
        console.error("Error fetching mappings:", error);
        toast.error("Failed to load mappings");
      } else {
        setMappings(data || []);
      }
      setLoading(false);
    }

    if (!seriesLoading && !venueTypesLoading) {
      fetchMappings();
    }
  }, [seriesLoading, venueTypesLoading]);

  const isMapped = (seriesId: string, venueTypeId: string) => {
    return mappings.some(
      (m) => m.series_id === seriesId && m.venue_type_id === venueTypeId
    );
  };

  const toggleMapping = async (seriesId: string, venueTypeId: string) => {
    setSaving(true);
    const supabase = createClient();
    const exists = isMapped(seriesId, venueTypeId);

    if (exists) {
      // Remove mapping
      const { error } = await supabase
        .from("series_venue_types")
        .delete()
        .eq("series_id", seriesId)
        .eq("venue_type_id", venueTypeId);

      if (error) {
        console.error("Error removing mapping:", error);
        toast.error("Failed to remove mapping");
      } else {
        setMappings((prev) =>
          prev.filter(
            (m) => !(m.series_id === seriesId && m.venue_type_id === venueTypeId)
          )
        );
        toast.success("Mapping removed");
      }
    } else {
      // Add mapping
      const { error } = await supabase
        .from("series_venue_types")
        .insert({ series_id: seriesId, venue_type_id: venueTypeId });

      if (error) {
        console.error("Error adding mapping:", error);
        toast.error("Failed to add mapping");
      } else {
        setMappings((prev) => [...prev, { series_id: seriesId, venue_type_id: venueTypeId }]);
        toast.success("Mapping added");
      }
    }
    setSaving(false);
  };

  if (loading || seriesLoading || venueTypesLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading mappings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Series ↔ Venue Type Mappings</h2>
        <p className="text-gray-600">
          Control which concert series are appropriate for each venue type. Click to toggle.
        </p>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-semibold">Concert Series</th>
                {venueTypes.map((vt) => (
                  <th key={vt.id} className="text-center py-3 px-2 font-medium text-sm">
                    <div className="flex flex-col items-center gap-1">
                      <span className="writing-mode-vertical text-xs">{vt.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {series.filter(s => s.is_active).map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <div>
                      <p className="font-medium">{s.title}</p>
                      {s.tagline && (
                        <p className="text-xs text-gray-500 italic">{s.tagline}</p>
                      )}
                    </div>
                  </td>
                  {venueTypes.map((vt) => {
                    const mapped = isMapped(s.id, vt.id);
                    return (
                      <td key={vt.id} className="text-center py-3 px-2">
                        <Button
                          variant={mapped ? "default" : "outline"}
                          size="sm"
                          className={`h-8 w-8 p-0 ${
                            mapped
                              ? "bg-green-600 hover:bg-green-700"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => toggleMapping(s.id, vt.id)}
                          disabled={saving}
                        >
                          {mapped ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <X className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">💡 How this works</p>
            <ul className="space-y-1 text-blue-800">
              <li>• Green checkmark = Series is allowed at this venue type</li>
              <li>• Gray X = Series is not available for this venue type</li>
              <li>• Performers will only see concerts with valid series-venue matches</li>
              <li>• Booking attempts for invalid combos will be rejected</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <div className="text-sm text-amber-900">
            <p className="font-semibold mb-1">⚠️ Current Mappings Summary</p>
            <div className="space-y-1 text-amber-800">
              {series.filter(s => s.is_active).map((s) => {
                const count = mappings.filter((m) => m.series_id === s.id).length;
                return (
                  <p key={s.id}>
                    <strong>{s.title}:</strong> {count} venue type{count !== 1 ? "s" : ""}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
