"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { getPieceStageSignedUrl } from "@/lib/storage/actions";
import { toast } from "sonner";
import { Search, Download, Music, Star, Library as LibraryIcon } from "lucide-react";

interface PieceStageData {
  id: string;
  stage: 1 | 2 | 3;
  score_url: string | null;
  audio_url: string | null;
  notes: string | null;
  piece: {
    id: string;
    title: string;
    composer: string | null;
    year_composed: number | null;
    collection: {
      id: string;
      title: string;
      series: {
        id: string;
        title: string;
      };
    };
  };
}

interface BookedPieceStage extends PieceStageData {
  booking: {
    id: string;
    concert: {
      scheduled_date: string;
      venue: {
        name: string;
      };
    };
  };
}

export default function LibraryPage() {
  const { user } = useAuth();
  const [pieceStages, setPieceStages] = useState<PieceStageData[]>([]);
  const [bookedPieceStages, setBookedPieceStages] = useState<BookedPieceStage[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>("all");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("all");
  const [selectedStage, setSelectedStage] = useState<string>("all");

  // Fetch all piece stages
  useEffect(() => {
    fetchPieceStages();
  }, []);

  // Fetch user's booked pieces
  useEffect(() => {
    if (user) {
      fetchBookedPieceStages();
    }
  }, [user]);

  const fetchPieceStages = async () => {
    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
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
      .order("piece.title");

    if (error) {
      console.error("Error fetching piece stages:", error);
      toast.error("Failed to load library");
    } else {
      setPieceStages(data || []);
    }

    setLoading(false);
  };

  const fetchBookedPieceStages = async () => {
    if (!user) return;

    const supabase = createClient();
    const today = new Date().toISOString();

    // For now, show booked pieces as empty since we need to restructure this
    // to work with the new schema where bookings link to pieces+stage, not piece_stages
    setBookedPieceStages([]);
  };

  // Extract unique series and collections for filters
  const { series, collections } = useMemo(() => {
    const seriesMap = new Map();
    const collectionsMap = new Map();

    pieceStages.forEach((ps: any) => {
      const serie = ps.piece?.collection?.series;
      const collection = ps.piece?.collection;

      if (serie && !seriesMap.has(serie.id)) {
        // Format series title for display (capitalize first letter)
        seriesMap.set(serie.id, {
          ...serie,
          displayName: serie.title.charAt(0).toUpperCase() + serie.title.slice(1)
        });
      }

      if (collection && !collectionsMap.has(collection.id)) {
        collectionsMap.set(collection.id, collection);
      }
    });

    return {
      series: Array.from(seriesMap.values()),
      collections: Array.from(collectionsMap.values()),
    };
  }, [pieceStages]);

  // Filter collections based on selected series
  const filteredCollections = useMemo(() => {
    if (selectedSeriesId === "all") return collections;
    return collections.filter((c: any) => c.series.id === selectedSeriesId);
  }, [collections, selectedSeriesId]);

  // Apply filters
  const filteredPieceStages = useMemo(() => {
    let filtered = [...pieceStages];

    // Text search
    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter((ps: any) => {
        const title = ps.piece?.title?.toLowerCase() || "";
        const composer = ps.piece?.composer?.toLowerCase() || "";
        const series = ps.piece?.collection?.series?.title?.toLowerCase() || "";
        const collection = ps.piece?.collection?.title?.toLowerCase() || "";

        return (
          title.includes(search) ||
          composer.includes(search) ||
          series.includes(search) ||
          collection.includes(search)
        );
      });
    }

    // Series filter
    if (selectedSeriesId !== "all") {
      filtered = filtered.filter(
        (ps: any) => ps.piece?.collection?.series?.id === selectedSeriesId
      );
    }

    // Collection filter
    if (selectedCollectionId !== "all") {
      filtered = filtered.filter((ps: any) => ps.piece?.collection?.id === selectedCollectionId);
    }

    // Stage filter
    if (selectedStage !== "all") {
      filtered = filtered.filter((ps) => ps.stage === parseInt(selectedStage));
    }

    return filtered;
  }, [pieceStages, searchText, selectedSeriesId, selectedCollectionId, selectedStage]);

  // Group filtered pieces by piece ID to show all stages together
  const groupedPieces = useMemo(() => {
    const groups = new Map();

    filteredPieceStages.forEach((ps: any) => {
      const pieceId = ps.piece?.id;
      if (!pieceId) return;

      if (!groups.has(pieceId)) {
        groups.set(pieceId, {
          piece: ps.piece,
          stages: [],
        });
      }

      groups.get(pieceId).stages.push(ps);
    });

    return Array.from(groups.values());
  }, [filteredPieceStages]);

  const handleDownload = async (pieceStageId: string, isBooked: boolean) => {
    if (isBooked && user) {
      // Use signed URL for booked pieces
      const result = await getPieceStageSignedUrl(pieceStageId, "score");
      if ("error" in result && result.error) {
        toast.error(result.error);
      } else if (result.signedUrl) {
        window.open(result.signedUrl, "_blank");
      }
    } else {
      // Use public URL for library browsing
      const ps = pieceStages.find((p) => p.id === pieceStageId);
      if (ps?.score_url) {
        window.open(ps.score_url, "_blank");
      } else {
        toast.error("Sheet music not available");
      }
    }
  };

  const handlePlayAudio = async (pieceStageId: string, isBooked: boolean) => {
    if (isBooked && user) {
      // Use signed URL for booked pieces
      const result = await getPieceStageSignedUrl(pieceStageId, "audio");
      if ("error" in result && result.error) {
        toast.error(result.error);
      } else if (result.signedUrl) {
        window.open(result.signedUrl, "_blank");
      }
    } else {
      // Use public URL for library browsing
      const ps = pieceStages.find((p) => p.id === pieceStageId);
      if (ps?.audio_url) {
        window.open(ps.audio_url, "_blank");
      } else {
        toast.error("Audio not available");
      }
    }
  };

  const getStageName = (stage: number) => {
    return stage === 1
      ? "Stage 1 - Beginner"
      : stage === 2
      ? "Stage 2 - Intermediate"
      : "Stage 3 - Advanced";
  };

  const handleReset = () => {
    setSearchText("");
    setSelectedSeriesId("all");
    setSelectedCollectionId("all");
    setSelectedStage("all");
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center py-12">
          <p className="text-gray-500">Loading library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <LibraryIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Music Library</h1>
        </div>
        <p className="text-gray-600">Browse and discover pieces from our collection</p>
      </div>

      {/* Quick Access - Booked Pieces */}
      {user && bookedPieceStages.length > 0 && (
        <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-blue-900">Quick Access - Your Booked Pieces</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookedPieceStages.map((ps: any) => (
              <Card key={ps.id} className="p-4 bg-white border-blue-300">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{ps.piece?.title}</h3>
                    {ps.piece?.composer && (
                      <p className="text-sm text-gray-600">{ps.piece.composer}</p>
                    )}
                  </div>
                  <Badge variant="default">{getStageName(ps.stage)}</Badge>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  <p>
                    <strong>Concert:</strong>{" "}
                    {new Date(ps.booking.concert.scheduled_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Venue:</strong> {ps.booking.concert.venue?.name}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {ps.score_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(ps.id, true)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                  {ps.audio_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlayAudio(ps.id, true)}
                    >
                      <Music className="w-4 h-4 mr-2" />
                      Listen
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search pieces, composers..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Series Filter */}
          <div>
            <Select value={selectedSeriesId} onValueChange={setSelectedSeriesId}>
              <SelectTrigger>
                <SelectValue placeholder="All Series" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Series</SelectItem>
                {series.map((s: any) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.displayName || s.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Collection Filter */}
          <div>
            <Select
              value={selectedCollectionId}
              onValueChange={setSelectedCollectionId}
              disabled={selectedSeriesId !== "all" && filteredCollections.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Collections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Collections</SelectItem>
                {filteredCollections.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stage Filter */}
          <div>
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger>
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="1">Stage 1 - Beginner</SelectItem>
                <SelectItem value="2">Stage 2 - Intermediate</SelectItem>
                <SelectItem value="3">Stage 3 - Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {groupedPieces.length} piece{groupedPieces.length !== 1 ? "s" : ""} found
          </p>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Library Grid */}
      {groupedPieces.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-gray-500">
            <LibraryIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Pieces Found</h3>
            <p className="text-sm">Try adjusting your filters or search terms.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedPieces.map(({ piece, stages }: any) => (
            <Card key={piece.id} className="p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-lg mb-1">{piece.title}</h3>
                {piece.composer && <p className="text-sm text-gray-600">{piece.composer}</p>}
                {piece.year_composed && (
                  <p className="text-xs text-gray-500">Composed: {piece.year_composed}</p>
                )}
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600">
                  <strong>Series:</strong> {piece.collection?.series?.title ?
                    piece.collection.series.title.charAt(0).toUpperCase() + piece.collection.series.title.slice(1) :
                    'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Collection:</strong> {piece.collection?.title}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Available Stages:</p>
                {stages.map((stage: any) => (
                  <Card key={stage.id} className="p-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="secondary">{getStageName(stage.stage)}</Badge>
                    </div>
                    {stage.notes && (
                      <p className="text-xs text-gray-600 mb-2">{stage.notes}</p>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      {stage.score_url ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(stage.id, false)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          PDF
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          <Download className="w-3 h-3 mr-1" />
                          PDF
                        </Button>
                      )}
                      {stage.audio_url ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePlayAudio(stage.id, false)}
                        >
                          <Music className="w-3 h-3 mr-1" />
                          Listen
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          <Music className="w-3 h-3 mr-1" />
                          Listen
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
