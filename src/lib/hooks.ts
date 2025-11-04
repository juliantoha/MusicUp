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
 * Fetch all venues
 */
export function useVenues(): UseListResult<Venue> {
  const [data, setData] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: venues, error: fetchError } = await supabase
        .from("venues")
        .select("*")
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
        .order("name");

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
        .order("display_order");

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
        .order("display_order");

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
          piece_stage:piece_stage_id (
            *,
            piece:piece_id (
              *,
              collection:collection_id (
                *,
                series:series_id (*)
              )
            )
          ),
          performer:performer_id (*)
        `)
        .eq("performer_id", user.id)
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
            performer_id
          )
        `)
        .eq("bookings.performer_id", user.id)
        .eq("status", "completed")
        .order("scheduled_date", { ascending: false });

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
            performer:performer_id (*),
            piece_stage:piece_stage_id (
              *,
              piece:piece_id (
                *,
                collection:collection_id (
                  *,
                  series:series_id (*)
                )
              )
            )
          )
        `)
        .eq("venue_id", venueId)
        .order("scheduled_date", { ascending: false });

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
