import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

// ============================================================================
// Supabase Inferred Types
// ============================================================================

// Helper to get database types
const supabase = createClient();

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "performer" | "admin" | "super_admin" | "venue_contact";
  profile_photo_path: string | null;
  created_at: string;
};

export type VenueType = {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  created_at: string;
};

export type Venue = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  contact_email: string | null;
  notes: string | null;
  is_active: boolean;
  venue_type_id: string | null;
  venue_contact_name: string | null;
  venue_contact_email: string | null;
  venue_contact_phone: string | null;
  interior_photo_url: string | null;
  exterior_photo_url: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

export type VenueWithType = Venue & {
  venue_type: VenueType | null;
};

export type AdminsVenue = {
  id: string;
  admin_id: string;
  venue_id: string;
  created_at: string;
};

export type Series = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  tagline: string | null;
  blurb: string | null;
  format: string | null;
  what_you_get: string | null;
  is_active: boolean;
  created_at: string;
};

export type SeriesVenueType = {
  id: string;
  series_id: string;
  venue_type_id: string;
  created_at: string;
};

export type SeriesWithVenueTypes = Series & {
  venue_types: VenueType[];
};

export type Collection = {
  id: string;
  series_id: string;
  title: string;
  description: string | null;
  is_primary: boolean;
  order_index: number;
  created_at: string;
};

export type Piece = {
  id: string;
  collection_id: string;
  title: string;
  composer: string | null;
  year_composed: number | null;
  image_url: string | null;
  order_index: number;
  created_at: string;
};

export type PieceStage = {
  id: string;
  piece_id: string;
  stage: 1 | 2 | 3;
  score_url: string | null;
  audio_url: string | null;
  notes: string | null;
  created_at: string;
};

export type Concert = {
  id: string;
  venue_id: string;
  series_id: string;
  starts_at: string; // TIMESTAMPTZ - combined date and time
  ends_at: string; // TIMESTAMPTZ - combined date and time
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  notes: string | null;
  created_at: string;
};

export type Booking = {
  id: string;
  concert_id: string;
  profile_id: string;
  piece_id: string;
  stage: 1 | 2 | 3;
  status: "booked" | "changed" | "cancelled" | "performed" | "absent";
  created_at: string;
};

export type AttendanceCheck = {
  id: string;
  booking_id: string;
  checked_in_at: string;
  checked_in_by: string;
};

export type ConcertPhoto = {
  id: string;
  concert_id: string;
  photo_url: string;
  caption: string | null;
  uploaded_by: string;
  uploaded_at: string;
};

export type ServiceHour = {
  id: string;
  performer_id: string;
  concert_id: string;
  hours: number;
  status: "pending" | "approved" | "rejected";
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
};

export type Log = {
  id: string;
  event: string;
  actor_profile_id: string | null;
  payload: Record<string, any> | null;
  created_at: string;
};

export type VenueWaiver = {
  id: string;
  venue_id: string;
  title: string;
  waiver_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type SignedWaiver = {
  id: string;
  waiver_id: string;
  profile_id: string;
  signed_pdf_url: string;
  signed_at: string;
};

export type SignedWaiverWithDetails = SignedWaiver & {
  profile: Profile;
  waiver: VenueWaiver;
};

export type VenueWaiverWithSignatures = VenueWaiver & {
  signed_waivers: SignedWaiver[];
};

// ============================================================================
// Extended Types with Relations
// ============================================================================

export type CollectionWithSeries = Collection & {
  series: Series;
};

export type PieceWithCollection = Piece & {
  collection: CollectionWithSeries;
};

export type PieceStageWithPiece = PieceStage & {
  piece: PieceWithCollection;
};

export type BookingWithDetails = Booking & {
  concert: Concert & {
    venue: Venue;
    series: Series;
  };
  piece: PieceWithCollection;
  profile: Profile;
};

export type ConcertWithDetails = Concert & {
  venue: VenueWithType;
  series: Series;
  bookings?: BookingWithDetails[];
};

export type ServiceHourWithDetails = ServiceHour & {
  concert: Concert & {
    venue: Venue;
    series: Series;
  };
  performer: Profile;
  approver?: Profile | null;
};

// ============================================================================
// Zod Schemas for Client Validation
// ============================================================================

export const profileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().nullable(),
  role: z.enum(["performer", "admin", "super_admin", "venue_contact"]),
  created_at: z.string(),
});

export const venueSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Venue name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "State must be 2 characters"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  contact_email: z.string().email().nullable().or(z.literal("")),
  notes: z.string().nullable(),
  is_active: z.boolean(),
  venue_type_id: z.string().uuid().nullable(),
  venue_contact_name: z.string().min(1, "Venue contact name is required").nullable().or(z.literal("")),
  venue_contact_email: z.string().email("Invalid email address").nullable().or(z.literal("")),
  venue_contact_phone: z.string().nullable().or(z.literal("")),
  interior_photo_url: z.string().url().nullable().or(z.literal("")),
  exterior_photo_url: z.string().url().nullable().or(z.literal("")),
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
  created_at: z.string(),
});

export const seriesSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1, "Series slug is required"),
  title: z.string().min(1, "Series title is required"),
  description: z.string().nullable(),
  created_at: z.string(),
});

export const collectionSchema = z.object({
  id: z.string().uuid(),
  series_id: z.string().uuid(),
  title: z.string().min(1, "Collection title is required"),
  description: z.string().nullable(),
  is_primary: z.boolean(),
  order_index: z.number().int().nonnegative(),
  created_at: z.string(),
});

export const pieceSchema = z.object({
  id: z.string().uuid(),
  collection_id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  composer: z.string().nullable(),
  year_composed: z.number().int().min(1000).max(9999).nullable(),
  order_index: z.number().int().nonnegative(),
  created_at: z.string(),
});

export const pieceStageSchema = z.object({
  id: z.string().uuid(),
  piece_id: z.string().uuid(),
  stage: z.enum(["stage_1", "stage_2", "stage_3"]),
  score_url: z.string().url().nullable().or(z.literal("")),
  audio_url: z.string().url().nullable().or(z.literal("")),
  notes: z.string().nullable(),
  created_at: z.string(),
});

export const concertSchema = z.object({
  id: z.string().uuid(),
  venue_id: z.string().uuid(),
  series_id: z.string().uuid(),
  starts_at: z.string(), // ISO 8601 timestamp
  ends_at: z.string(), // ISO 8601 timestamp
  status: z.enum(["scheduled", "in_progress", "completed", "cancelled"]),
  notes: z.string().nullable(),
  created_at: z.string(),
});

export const bookingSchema = z.object({
  id: z.string().uuid(),
  concert_id: z.string().uuid(),
  performer_id: z.string().uuid(),
  piece_stage_id: z.string().uuid(),
  status: z.enum(["pending", "confirmed", "cancelled"]),
  created_at: z.string(),
  updated_at: z.string(),
});

export const serviceHourSchema = z.object({
  id: z.string().uuid(),
  performer_id: z.string().uuid(),
  concert_id: z.string().uuid(),
  hours: z.number().positive().max(24, "Hours must be 24 or less"),
  status: z.enum(["pending", "approved", "rejected"]),
  approved_by: z.string().uuid().nullable(),
  approved_at: z.string().nullable(),
  created_at: z.string(),
});

// ============================================================================
// Insert/Update Schemas (for forms)
// ============================================================================

export const venueInsertSchema = venueSchema.omit({ id: true, created_at: true });
export const venueUpdateSchema = venueInsertSchema.partial();

// Schema specifically for updating venue contact info (used by venue admins)
export const venueContactUpdateSchema = z.object({
  venue_contact_name: z.string().min(1, "Venue contact name is required").nullable().or(z.literal("")),
  venue_contact_email: z.string().email("Invalid email address").nullable().or(z.literal("")),
  venue_contact_phone: z.string().nullable().or(z.literal("")),
}).partial();

export const seriesInsertSchema = seriesSchema.omit({ id: true, created_at: true });
export const seriesUpdateSchema = seriesInsertSchema.partial();

export const collectionInsertSchema = collectionSchema.omit({ id: true, created_at: true });
export const collectionUpdateSchema = collectionInsertSchema.partial();

export const pieceInsertSchema = pieceSchema.omit({ id: true, created_at: true });
export const pieceUpdateSchema = pieceInsertSchema.partial();

export const pieceStageInsertSchema = pieceStageSchema.omit({ id: true, created_at: true });
export const pieceStageUpdateSchema = pieceStageInsertSchema.partial();

export const concertInsertSchema = concertSchema.omit({ id: true, created_at: true });
export const concertUpdateSchema = concertInsertSchema.partial();

export const bookingInsertSchema = bookingSchema.omit({ id: true, created_at: true, updated_at: true });
export const bookingUpdateSchema = bookingInsertSchema.omit({ concert_id: true, performer_id: true }).partial();

export const serviceHourInsertSchema = serviceHourSchema.omit({ id: true, created_at: true });
export const serviceHourUpdateSchema = serviceHourInsertSchema.partial();

// ============================================================================
// Type exports for Insert/Update
// ============================================================================

export type VenueInsert = z.infer<typeof venueInsertSchema>;
export type VenueUpdate = z.infer<typeof venueUpdateSchema>;
export type VenueContactUpdate = z.infer<typeof venueContactUpdateSchema>;

export type SeriesInsert = z.infer<typeof seriesInsertSchema>;
export type SeriesUpdate = z.infer<typeof seriesUpdateSchema>;

export type CollectionInsert = z.infer<typeof collectionInsertSchema>;
export type CollectionUpdate = z.infer<typeof collectionUpdateSchema>;

export type PieceInsert = z.infer<typeof pieceInsertSchema>;
export type PieceUpdate = z.infer<typeof pieceUpdateSchema>;

export type PieceStageInsert = z.infer<typeof pieceStageInsertSchema>;
export type PieceStageUpdate = z.infer<typeof pieceStageUpdateSchema>;

export type ConcertInsert = z.infer<typeof concertInsertSchema>;
export type ConcertUpdate = z.infer<typeof concertUpdateSchema>;

export type BookingInsert = z.infer<typeof bookingInsertSchema>;
export type BookingUpdate = z.infer<typeof bookingUpdateSchema>;

export type ServiceHourInsert = z.infer<typeof serviceHourInsertSchema>;
export type ServiceHourUpdate = z.infer<typeof serviceHourUpdateSchema>;
