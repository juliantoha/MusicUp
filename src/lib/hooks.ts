"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type {
  Venue,
  Series,
  Collection,
  CollectionWithSeries,
  Piece,
  PieceWithCollection,
  PieceStage,
  PieceStageWithPiece,
  BookingWithDetails,
  ServiceHourWithDetails,
  ConcertWithDetails,
} from "@/types/db";

// ============================================================================
// Hook Return Types
// ============================================================================

interface UseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface UseListResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

// ============================================================================
// Library Hooks (Public Data)
// ============================================================================

/**
 * Fetch all venues with venue type information
 */
export function useVenues(): UseListResult<any> {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: venues, error: fetchError } = await supabase
        .from("venues")
        .select(`
          *,
          venue_type:venue_type_id (
            id,
            slug,
            label,
            description
          )
        `)
        .order("name");

      if (fetchError) throw fetchError;
      setData(venues || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch venues"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  return { data, loading, error, refetch: fetchVenues };
}

/**
 * Fetch all venue types
 */
export function useVenueTypes(): UseListResult<any> {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVenueTypes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: venueTypes, error: fetchError } = await supabase
        .from("venue_types")
        .select("*")
        .order("label");

      if (fetchError) throw fetchError;
      setData(venueTypes || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch venue types"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVenueTypes();
  }, [fetchVenueTypes]);

  return { data, loading, error, refetch: fetchVenueTypes };
}

/**
 * Fetch all series
 */
export function useSeries(): UseListResult<Series> {
  const [data, setData] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSeries = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: series, error: fetchError } = await supabase
        .from("series")
        .select("*")
        .order("title");

      if (fetchError) throw fetchError;
      setData(series || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch series"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeries();
  }, [fetchSeries]);

  return { data, loading, error, refetch: fetchSeries };
}

/**
 * Fetch series with their valid venue type mappings
 * Returns series with an array of venue_type_ids they're valid for
 */
export function useSeriesWithVenueTypes(): UseListResult<any> {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSeriesWithVenueTypes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Fetch all series
      const { data: series, error: seriesError } = await supabase
        .from("series")
        .select("*")
        .order("title");

      if (seriesError) throw seriesError;

      // Fetch all series-venue-type mappings
      const { data: mappings, error: mappingsError } = await supabase
        .from("series_venue_types")
        .select("series_id, venue_type_id");

      if (mappingsError) throw mappingsError;

      // Combine data
      const seriesWithVenueTypes = (series || []).map(s => ({
        ...s,
        venue_type_ids: (mappings || [])
          .filter(m => m.series_id === s.id)
          .map(m => m.venue_type_id)
      }));

      setData(seriesWithVenueTypes);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch series with venue types"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeriesWithVenueTypes();
  }, [fetchSeriesWithVenueTypes]);

  return { data, loading, error, refetch: fetchSeriesWithVenueTypes };
}

/**
 * Fetch collections for a specific series
 */
export function useCollections(seriesId?: string): UseListResult<CollectionWithSeries> {
  const [data, setData] = useState<CollectionWithSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCollections = useCallback(async () => {
    if (!seriesId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: collections, error: fetchError } = await supabase
        .from("collections")
        .select(`
          *,
          series:series_id (*)
        `)
        .eq("series_id", seriesId)
        .order("order_index");

      if (fetchError) throw fetchError;
      setData(collections || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch collections"));
    } finally {
      setLoading(false);
    }
  }, [seriesId]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return { data, loading, error, refetch: fetchCollections };
}

/**
 * Fetch pieces for a specific collection
 */
export function usePieces(collectionId?: string): UseListResult<PieceWithCollection> {
  const [data, setData] = useState<PieceWithCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPieces = useCallback(async () => {
    if (!collectionId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: pieces, error: fetchError } = await supabase
        .from("pieces")
        .select(`
          *,
          collection:collection_id (
            *,
            series:series_id (*)
          )
        `)
        .eq("collection_id", collectionId)
        .order("order_index");

      if (fetchError) throw fetchError;
      setData(pieces || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch pieces"));
    } finally {
      setLoading(false);
    }
  }, [collectionId]);

  useEffect(() => {
    fetchPieces();
  }, [fetchPieces]);

  return { data, loading, error, refetch: fetchPieces };
}

/**
 * Fetch stages for a specific piece
 */
export function useStages(pieceId?: string): UseListResult<PieceStageWithPiece> {
  const [data, setData] = useState<PieceStageWithPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStages = useCallback(async () => {
    if (!pieceId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: stages, error: fetchError } = await supabase
        .from("piece_stages")
        .select(`
          *,
          piece:piece_id (
            *,
            collection:collection_id (
              *,
              series:series_id (*)
            )
          )
        `)
        .eq("piece_id", pieceId)
        .order("stage");

      if (fetchError) throw fetchError;
      setData(stages || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch stages"));
    } finally {
      setLoading(false);
    }
  }, [pieceId]);

  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  return { data, loading, error, refetch: fetchStages };
}

// ============================================================================
// Performer Hooks (Auth Required)
// ============================================================================

/**
 * Fetch current user's bookings with full details
 */
export function useMyBookings(): UseListResult<BookingWithDetails> {
  const { user } = useAuth();
  const [data, setData] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: bookings, error: fetchError } = await supabase
        .from("bookings")
        .select(`
          *,
          concert:concert_id (
            *,
            venue:venue_id (*),
            series:series_id (*)
          ),
          piece:piece_id (
            *,
            collection:collection_id (
              *,
              series:series_id (*)
            )
          ),
          profile:profile_id (*)
        `)
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setData(bookings || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch bookings"));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { data, loading, error, refetch: fetchBookings };
}

/**
 * Fetch current user's service hours with details
 */
export function useMyServiceHours(): UseListResult<ServiceHourWithDetails> {
  const { user } = useAuth();
  const [data, setData] = useState<ServiceHourWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchServiceHours = useCallback(async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: serviceHours, error: fetchError } = await supabase
        .from("service_hours")
        .select(`
          *,
          concert:concert_id (
            *,
            venue:venue_id (*),
            series:series_id (*)
          ),
          performer:performer_id (*),
          approver:approved_by (*)
        `)
        .eq("performer_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setData(serviceHours || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch service hours"));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchServiceHours();
  }, [fetchServiceHours]);

  return { data, loading, error, refetch: fetchServiceHours };
}

/**
 * Fetch past concerts where the current user performed
 */
export function useMyPastConcerts(): UseListResult<ConcertWithDetails> {
  const { user } = useAuth();
  const [data, setData] = useState<ConcertWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPastConcerts = useCallback(async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: concerts, error: fetchError } = await supabase
        .from("concerts")
        .select(`
          *,
          venue:venue_id (*),
          series:series_id (*),
          bookings!inner (
            *,
            profile_id
          )
        `)
        .eq("bookings.profile_id", user.id)
        .eq("status", "completed")
        .order("starts_at", { ascending: false });

      if (fetchError) throw fetchError;
      setData(concerts || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch past concerts"));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPastConcerts();
  }, [fetchPastConcerts]);

  return { data, loading, error, refetch: fetchPastConcerts };
}

// ============================================================================
// Admin Hooks
// ============================================================================

/**
 * Fetch venues managed by current admin
 */
export function useMyManagedVenues(): UseListResult<Venue> {
  const { user } = useAuth();
  const [data, setData] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchManagedVenues = useCallback(async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: adminVenues, error: fetchError } = await supabase
        .from("admins_venues")
        .select(`
          venue:venue_id (*)
        `)
        .eq("admin_id", user.id);

      if (fetchError) throw fetchError;

      // Extract venues from the join
      const venues = adminVenues?.map((av: any) => av.venue).filter(Boolean) || [];
      setData(venues);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch managed venues"));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchManagedVenues();
  }, [fetchManagedVenues]);

  return { data, loading, error, refetch: fetchManagedVenues };
}

/**
 * Fetch upcoming concerts for venues managed by current admin
 */
export function useMyManagedConcerts(): UseListResult<ConcertWithDetails> {
  const { user } = useAuth();
  const [data, setData] = useState<ConcertWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchManagedConcerts = useCallback(async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const today = new Date().toISOString();

      // First get the venue IDs the admin manages
      const { data: adminVenues, error: venuesError } = await supabase
        .from("admins_venues")
        .select("venue_id")
        .eq("admin_id", user.id);

      if (venuesError) throw venuesError;

      const venueIds = adminVenues?.map((av) => av.venue_id) || [];

      if (venueIds.length === 0) {
        setData([]);
        setLoading(false);
        return;
      }

      // Fetch concerts for those venues
      const { data: concerts, error: fetchError } = await supabase
        .from("concerts")
        .select(`
          *,
          venue:venue_id (*),
          series:series_id (*),
          bookings (
            *,
            profile:profile_id (*),
            piece:piece_id (
              *,
              collection:collection_id (
                *,
                series:series_id (*)
              )
            )
          )
        `)
        .in("venue_id", venueIds)
        .eq("status", "scheduled")
        .gte("starts_at", today)
        .order("starts_at", { ascending: true });

      if (fetchError) throw fetchError;
      setData(concerts || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch managed concerts"));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchManagedConcerts();
  }, [fetchManagedConcerts]);

  return { data, loading, error, refetch: fetchManagedConcerts };
}

/**
 * Fetch concerts for a specific venue (admin only)
 */
export function useVenueConcerts(venueId?: string): UseListResult<ConcertWithDetails> {
  const [data, setData] = useState<ConcertWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVenueConcerts = useCallback(async () => {
    if (!venueId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: concerts, error: fetchError } = await supabase
        .from("concerts")
        .select(`
          *,
          venue:venue_id (*),
          series:series_id (*),
          bookings (
            *,
            profile:profile_id (*),
            piece:piece_id (
              *,
              collection:collection_id (
                *,
                series:series_id (*)
              )
            )
          )
        `)
        .eq("venue_id", venueId)
        .order("starts_at", { ascending: false });

      if (fetchError) throw fetchError;
      setData(concerts || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch venue concerts"));
    } finally {
      setLoading(false);
    }
  }, [venueId]);

  useEffect(() => {
    fetchVenueConcerts();
  }, [fetchVenueConcerts]);

  return { data, loading, error, refetch: fetchVenueConcerts };
}

// ============================================================================
// Booking Hooks
// ============================================================================

/**
 * Fetch upcoming concerts at a specific venue (for booking)
 * Filters out concerts with invalid series-venue type combinations
 */
export function useUpcomingConcerts(venueId?: string): UseListResult<ConcertWithDetails> {
  const [data, setData] = useState<ConcertWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUpcomingConcerts = useCallback(async () => {
    if (!venueId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const today = new Date().toISOString(); // Full ISO timestamp

      const { data: concerts, error: fetchError } = await supabase
        .from("concerts")
        .select(`
          *,
          venue:venue_id (
            *,
            venue_type:venue_type_id (*)
          ),
          series:series_id (*)
        `)
        .eq("venue_id", venueId)
        .eq("status", "scheduled")
        .gte("starts_at", today)
        .order("starts_at", { ascending: true });

      if (fetchError) throw fetchError;

      // Filter concerts to only include those with valid series-venue type matches
      // or concerts at venues without a type (backwards compatibility)
      const validConcerts = await Promise.all(
        (concerts || []).map(async (concert) => {
          // If venue has no type, allow all series
          if (!concert.venue?.venue_type_id) {
            return concert;
          }

          // Check if this series-venue type combo is valid
          const { data: mapping } = await supabase
            .from("series_venue_types")
            .select("id")
            .eq("series_id", concert.series_id)
            .eq("venue_type_id", concert.venue.venue_type_id)
            .maybeSingle();

          // Only include concerts with valid mappings
          return mapping ? concert : null;
        })
      );

      // Filter out null values (invalid concerts)
      const filteredConcerts = validConcerts.filter((c): c is ConcertWithDetails => c !== null);

      setData(filteredConcerts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch upcoming concerts"));
    } finally {
      setLoading(false);
    }
  }, [venueId]);

  useEffect(() => {
    fetchUpcomingConcerts();
  }, [fetchUpcomingConcerts]);

  return { data, loading, error, refetch: fetchUpcomingConcerts };
}

/**
 * Fetch current user's upcoming bookings
 */
export function useMyUpcomingBookings(): UseListResult<BookingWithDetails> {
  const { user } = useAuth();
  const [data, setData] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUpcomingBookings = useCallback(async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const today = new Date().toISOString(); // Full timestamp for comparison

      const { data: bookings, error: fetchError } = await supabase
        .from("bookings")
        .select(`
          *,
          concert:concert_id (
            *,
            venue:venue_id (*),
            series:series_id (*)
          ),
          piece:piece_id (
            *,
            collection:collection_id (
              *,
              series:series_id (*)
            )
          ),
          profile:profile_id (*)
        `)
        .eq("profile_id", user.id)
        .neq("status", "cancelled")
        .gte("concert.starts_at", today)
        .order("concert.starts_at", { ascending: true });

      if (fetchError) throw fetchError;
      setData(bookings || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch upcoming bookings"));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUpcomingBookings();
  }, [fetchUpcomingBookings]);

  return { data, loading, error, refetch: fetchUpcomingBookings };
}

// ============================================================================
// Super Admin Hooks
// ============================================================================

/**
 * Fetch all profiles (super admin only)
 */
export function useAllProfiles(): UseListResult<any> {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: profiles, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setData(profiles || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch profiles"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return { data, loading, error, refetch: fetchProfiles };
}
