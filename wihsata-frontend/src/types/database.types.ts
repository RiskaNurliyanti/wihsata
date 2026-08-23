// Tipe-tipe ini merepresentasikan skema Supabase pada supabase/migrations/0001_init.sql.
// Setelah project di-link ke Supabase, disarankan generate ulang via:
//   npx supabase gen types typescript --project-id <id> > src/types/database.types.ts

export type SubscriptionTier = 'demo' | 'pro';
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'trialing';
export type TripStatus = 'draft' | 'upcoming' | 'completed' | 'archived';

export interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  home_city: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  created_at: string;
}

export interface District {
  id: string;
  name: string;
  province: string;
  created_at: string;
}

export type DestinationAccessType = 'darat' | 'kapal' | 'kombinasi';

export interface Destination {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category_id: string | null;
  district_id: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  price_range: string | null;
  opening_hours: Record<string, string> | null;
  facilities: string[] | null;
  cover_image_url: string | null;
  gallery_urls: string[] | null;
  google_maps_url: string | null;
  rating: number;
  review_count: number;
  safety_score: number | null;
  safety_source: string | null;
  is_featured: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Akses penyeberangan — lihat migration 0005_boat_access.sql
  access_type: DestinationAccessType;
  departure_port: string | null;
  crossing_duration_minutes: number | null;
  crossing_cost_estimate: number | null;
  crossing_notes: string | null;
  // relasi opsional (join)
  category?: Category | null;
  district?: District | null;
  distance_km?: number;
}

export interface Review {
  id: string;
  destination_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  photo_urls: string[] | null;
  created_at: string;
  user?: Profile;
}

export interface ItineraryItem {
  time: string;
  destination_id?: string;
  destination_name: string;
  activity: string;
  estimated_cost: number;
  notes?: string;
  image_url?: string;
  /** Ditambahkan Fase 6 — dihitung server-side dari rute jalan sungguhan (OSRM), bukan garis lurus. */
  distance_km?: number;
  travel_time_minutes?: number;
  transport_mode?: TransportMode;
  reason?: string;
}

export interface ItineraryDay {
  day: number;
  date?: string;
  items: ItineraryItem[];
  subtotal: number;
  /** Ditambahkan Fase 6 — total waktu perjalanan (bukan kunjungan) di hari ini. */
  total_travel_time_minutes?: number;
}

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  start_date: string | null;
  end_date: string | null;
  status: TripStatus;
  budget_estimate: number | null;
  preferences: AiPlannerInput | null;
  itinerary: ItineraryDay[];
  cover_image_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  current_period_end: string | null;
  ai_generation_count_today: number;
  ai_generation_reset_at: string;
  trips_saved_count: number;
  created_at: string;
  updated_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: Profile;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  destination_id: string | null;
  caption: string | null;
  image_urls: string[];
  like_count: number;
  created_at: string;
  user?: Profile;
  destination?: Destination | null;
}

export interface ArticleComment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: Profile;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string | null;
  author_id: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  author?: Profile;
  comments?: ArticleComment[];
}

// ── Input untuk AI Planner ──────────────────────────────────────────
export type TransportMode = 'private_vehicle' | 'rental_vehicle' | 'public_transport';

export interface AiPlannerInput {
  /** Kota/titik keberangkatan — wajib diisi (lihat ai-planner.schema.ts). */
  origin_location: string;
  destination_area: string;
  start_date: string;
  end_date: string;
  /** Jam keberangkatan hari pertama & jam kepulangan hari terakhir, format "HH:MM". */
  departure_time: string;
  return_time: string;
  travelers_count: number;
  budget_total: number;
  interests: string[];       // e.g. ['alam', 'kuliner', 'budaya']
  travel_pace: 'santai' | 'normal' | 'padat';
  /** Ditambahkan Fase 6 — wajib diisi, mempengaruhi estimasi waktu tempuh & gaya itinerary. */
  transport_mode: TransportMode;
  notes?: string;
}

export interface AiPlannerOutput {
  summary: string;
  total_estimated_cost: number;
  days: ItineraryDay[];
  recommendations: string[];
  weather_note?: string;
  /** Ditambahkan Fase 6 — additive, tidak menghapus field lama di atas. */
  transport_mode?: TransportMode;
  return_trip_estimate?: {
    distance_km: number;
    travel_time_minutes: number;
  };
}

// Limit tier Demo vs Pro — dipakai FE & BE agar konsisten
export const TIER_LIMITS = {
  demo: {
    aiGenerationsPerDay: 2,
    maxTripsSaved: 3,
    downloadPdf: false,
    offlineGuide: false,
    hiddenGems: false,
    aiTools: false,
    adFree: false,
  },
  pro: {
    aiGenerationsPerDay: Infinity,
    maxTripsSaved: Infinity,
    downloadPdf: true,
    offlineGuide: true,
    hiddenGems: true,
    aiTools: true,
    adFree: true,
  },
} as const;
