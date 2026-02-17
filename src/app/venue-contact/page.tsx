"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Music, Phone, Mail, User, Image as ImageIcon, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { Logo } from "@/components/Logo";
import { WaiverSigningPanel } from "@/components/WaiverSigningPanel";
import { SignedWaiversView } from "@/components/SignedWaiversView";
import { getUnsignedWaivers } from "@/lib/waivers/actions";
import type { VenueWaiver } from "@/types/db";

type Concert = {
  id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  series: {
    title: string;
    slug: string;
  };
  venue: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
  };
};

type Booking = {
  id: string;
  status: string;
  profile: {
    id: string;
    full_name: string;
    email: string;
  };
  piece: {
    title: string;
  };
  stage: number;
};

type ConcertPhoto = {
  id: string;
  photo_path: string;
  uploaded_by: string;
  created_at: string;
};

type HostContact = {
  profile: {
    full_name: string;
    email: string;
  };
};

export default function VenueContactDashboard() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [venues, setVenues] = useState<any[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [upcomingConcerts, setUpcomingConcerts] = useState<Concert[]>([]);
  const [pastConcerts, setPastConcerts] = useState<Concert[]>([]);
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);
  const [concertBookings, setConcertBookings] = useState<Booking[]>([]);
  const [concertPhotos, setConcertPhotos] = useState<ConcertPhoto[]>([]);
  const [hostContacts, setHostContacts] = useState<HostContact[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [unsignedWaivers, setUnsignedWaivers] = useState<VenueWaiver[]>([]);
  const [loadingWaivers, setLoadingWaivers] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !profile)) {
      router.push("/login");
    } else if (profile && profile.role !== "venue_contact") {
      // Redirect non-venue contacts
      if (profile.role === "super_admin") {
        router.push("/super");
      } else if (profile.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/performer");
      }
    }
  }, [user, profile, loading, router]);

  // Fetch venues for this venue contact
  useEffect(() => {
    if (!profile || profile.role !== "venue_contact") return;

    const fetchVenues = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("venue_contacts")
        .select(`
          id,
          venue:venues(
            id,
            name,
            address,
            city,
            state,
            zip
          )
        `)
        .eq("profile_id", profile.id)
        .eq("status", "active");

      if (error) {
        console.error("Error fetching venues:", error);
        return;
      }

      const venueList = (data?.map(vc => vc.venue).filter(Boolean) || []) as any[];
      setVenues(venueList);

      if (venueList.length > 0 && venueList[0]?.id) {
        setSelectedVenueId(venueList[0].id);
      }
    };

    fetchVenues();
  }, [profile]);

  // Fetch concerts when venue is selected
  useEffect(() => {
    if (!selectedVenueId) return;

    const fetchConcerts = async () => {
      setLoadingData(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("concerts")
        .select(`
          id,
          starts_at,
          ends_at,
          status,
          series:series(title, slug),
          venue:venues(id, name, address, city, state)
        `)
        .eq("venue_id", selectedVenueId)
        .order("starts_at", { ascending: true });

      if (error) {
        console.error("Error fetching concerts:", error);
        setLoadingData(false);
        return;
      }

      const now = new Date();
      const upcoming = (data?.filter(c => new Date(c.starts_at) >= now && c.status === "scheduled") || []) as any[];
      const past = (data?.filter(c => new Date(c.starts_at) < now || c.status === "completed") || []) as any[];

      setUpcomingConcerts(upcoming as Concert[]);
      setPastConcerts(past as Concert[]);
      setLoadingData(false);
    };

    fetchConcerts();
  }, [selectedVenueId]);

  // Fetch waivers for selected venue
  useEffect(() => {
    if (!selectedVenueId) return;

    const fetchWaivers = async () => {
      setLoadingWaivers(true);
      const result = await getUnsignedWaivers(selectedVenueId);
      if ("unsignedWaivers" in result) {
        setUnsignedWaivers(result.unsignedWaivers);
      }
      setLoadingWaivers(false);
    };

    fetchWaivers();
  }, [selectedVenueId]);

  // Fetch host contacts for selected venue
  useEffect(() => {
    if (!selectedVenueId) return;

    const fetchHosts = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("admins_venues")
        .select(`
          profile:profiles(
            full_name,
            email
          )
        `)
        .eq("venue_id", selectedVenueId);

      if (error) {
        console.error("Error fetching hosts:", error);
        return;
      }

      setHostContacts((data || []) as any);
    };

    fetchHosts();
  }, [selectedVenueId]);

  // Fetch concert details when selected
  useEffect(() => {
    if (!selectedConcert) return;

    const fetchConcertDetails = async () => {
      const supabase = createClient();

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select(`
          id,
          status,
          stage,
          profile:profiles(id, full_name, email),
          piece:pieces(title)
        `)
        .eq("concert_id", selectedConcert.id);

      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError);
      } else {
        setConcertBookings((bookingsData || []) as any);
      }

      // Fetch photos
      const { data: photosData, error: photosError } = await supabase
        .from("concert_photos")
        .select("id, photo_path, uploaded_by, created_at")
        .eq("concert_id", selectedConcert.id)
        .order("created_at", { ascending: false });

      if (photosError) {
        console.error("Error fetching photos:", photosError);
      } else {
        setConcertPhotos((photosData || []) as any);
      }
    };

    fetchConcertDetails();
  }, [selectedConcert]);

  if (loading || !profile || profile.role !== "venue_contact") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Logo className="h-12 w-12 text-[#2563EB] animate-pulse mx-auto mb-4" animate />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const selectedVenue = venues.find(v => v.id === selectedVenueId);

  const stageColor = (stage: number) => {
    if (stage === 1) return "bg-green-50 text-green-700 border-green-200";
    if (stage === 2) return "bg-amber-50 text-amber-700 border-amber-200";
    if (stage === 3) return "bg-red-50 text-red-700 border-red-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Venue Contact Dashboard</h1>
        <p className="text-gray-500">Welcome back, {profile.full_name || user?.email}</p>
      </div>

      {venues.length === 0 ? (
        <Card className="border border-gray-100">
          <CardHeader>
            <CardTitle>No Venues Assigned</CardTitle>
            <CardDescription>
              You haven't been assigned to any venues yet. Contact your administrator for access.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          {/* Venue Selector */}
          {venues.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Venue</label>
              <select
                className="w-full max-w-md h-10 px-4 border border-gray-200 rounded-xl bg-white text-gray-900 focus:border-[#2563EB] focus:outline-none transition-colors"
                value={selectedVenueId || ""}
                onChange={(e) => setSelectedVenueId(e.target.value)}
              >
                {venues.map(venue => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name} - {venue.city}, {venue.state}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Venue Info Card */}
          {selectedVenue && (
            <Card className="mb-8 border border-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  {selectedVenue.name}
                </CardTitle>
                <CardDescription>
                  {selectedVenue.address}, {selectedVenue.city}, {selectedVenue.state} {selectedVenue.zip}
                </CardDescription>
              </CardHeader>
              {hostContacts.length > 0 && (
                <CardContent>
                  <h3 className="text-sm font-semibold mb-3">Host Contacts:</h3>
                  <div className="space-y-2">
                    {hostContacts.map((host: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 text-sm bg-gray-50 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{host.profile?.full_name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href={`mailto:${host.profile?.email}`} className="text-primary hover:underline">
                            {host.profile?.email}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Unsigned Waivers */}
          {!loadingWaivers && unsignedWaivers.length > 0 && selectedVenue && (
            <Card className="mb-8 border border-amber-200">
              <CardContent className="pt-6">
                <WaiverSigningPanel
                  waivers={unsignedWaivers}
                  venueName={selectedVenue.name}
                  onAllSigned={async () => {
                    if (selectedVenueId) {
                      const result = await getUnsignedWaivers(selectedVenueId);
                      if ("unsignedWaivers" in result) {
                        setUnsignedWaivers(result.unsignedWaivers);
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* My Signed Waivers */}
          <Card className="mb-8 border border-gray-100">
            <CardContent className="pt-6">
              <SignedWaiversView />
            </CardContent>
          </Card>

          {/* Concerts Tabs */}
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList>
              <TabsTrigger value="upcoming">
                Upcoming Concerts ({upcomingConcerts.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past Concerts ({pastConcerts.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {loadingData ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="border border-gray-100">
                      <CardHeader>
                        <div className="space-y-3 animate-pulse">
                          <div className="h-5 bg-gray-200 rounded-lg w-1/3" />
                          <div className="flex gap-4">
                            <div className="h-4 bg-gray-100 rounded-lg w-32" />
                            <div className="h-4 bg-gray-100 rounded-lg w-40" />
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : upcomingConcerts.length === 0 ? (
                <Card className="border border-gray-100">
                  <CardContent className="py-12 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-muted-foreground">No upcoming concerts scheduled</p>
                  </CardContent>
                </Card>
              ) : (
                upcomingConcerts.map(concert => (
                  <Card
                    key={concert.id}
                    className="cursor-pointer card-hover border border-gray-100 transition-shadow"
                    onClick={() => setSelectedConcert(concert as any)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{(concert.series as any)?.title || 'Concert'}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(concert.starts_at), "PPP")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {format(new Date(concert.starts_at), "p")} - {format(new Date(concert.ends_at), "p")}
                            </span>
                          </CardDescription>
                        </div>
                        <Badge>{concert.status}</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {loadingData ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="border border-gray-100">
                      <CardHeader>
                        <div className="space-y-3 animate-pulse">
                          <div className="h-5 bg-gray-200 rounded-lg w-1/3" />
                          <div className="flex gap-4">
                            <div className="h-4 bg-gray-100 rounded-lg w-32" />
                            <div className="h-4 bg-gray-100 rounded-lg w-40" />
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : pastConcerts.length === 0 ? (
                <Card className="border border-gray-100">
                  <CardContent className="py-12 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-muted-foreground">No past concerts</p>
                  </CardContent>
                </Card>
              ) : (
                pastConcerts.map(concert => (
                  <Card
                    key={concert.id}
                    className="cursor-pointer card-hover border border-gray-100 transition-shadow"
                    onClick={() => setSelectedConcert(concert as any)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{(concert.series as any)?.title || 'Concert'}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(concert.starts_at), "PPP")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {format(new Date(concert.starts_at), "p")}
                            </span>
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">{concert.status}</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>

          {/* Concert Details Modal/Sheet */}
          {selectedConcert && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border-0 shadow-2xl">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{(selectedConcert.series as any)?.title || 'Concert Details'}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(selectedConcert.starts_at), "PPP")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {format(new Date(selectedConcert.starts_at), "p")} - {format(new Date(selectedConcert.ends_at), "p")}
                        </span>
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 rounded-xl"
                      onClick={() => setSelectedConcert(null)}
                    >
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Performers */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Music className="h-5 w-5" />
                      Performers ({concertBookings.length})
                    </h3>
                    {concertBookings.length === 0 ? (
                      <div className="text-center py-6">
                        <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-2">
                          <Music className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-muted-foreground text-sm">No performers booked yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {concertBookings.map((booking: any) => (
                          <div key={booking.id} className="rounded-xl border border-gray-100 p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{booking.profile?.full_name || 'Unknown'}</p>
                                <p className="text-sm text-muted-foreground">{booking.profile?.email}</p>
                                <p className="text-sm mt-1">
                                  <span className="font-medium">Piece:</span> {booking.piece?.title || 'N/A'}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Stage:</span>{" "}
                                  <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium border ${stageColor(booking.stage)}`}>
                                    Stage {booking.stage}
                                  </span>
                                </p>
                              </div>
                              <Badge variant={booking.status === "performed" ? "default" : "secondary"}>
                                {booking.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Photos */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Concert Photos ({concertPhotos.length})
                    </h3>
                    {concertPhotos.length === 0 ? (
                      <div className="text-center py-6">
                        <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-2">
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-muted-foreground text-sm">No photos uploaded yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {concertPhotos.map(photo => {
                          const supabase = createClient();
                          const { data } = supabase.storage
                            .from("concert_photos")
                            .getPublicUrl(photo.photo_path);

                          return (
                            <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                              <img
                                src={data.publicUrl}
                                alt="Concert photo"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
