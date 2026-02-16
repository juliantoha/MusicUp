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
import { Search, Download, Music, Star, Library as LibraryIcon, X } from "lucide-react";

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
        seriesMap.set(serie.id, {
          ...serie,
          displayName: serie.title.charAt(0).toUpperCase() + serie.title.slice(1)
        });
      }

      if (collection && !collectionsMap.has(collection.id)) {
        collectionsMap.set(collection.id, collection);
      }
    });

    const allSeries = Array.from(seriesMap.values());
    const filteredSeries = allSeries.filter((s: any) =>
      s.title?.toLowerCase() === 'empathy' || s.slug === 'empathy'
    );

    return {
      series: filteredSeries,
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

    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter((ps: any) => {
        const title = ps.piece?.title?.toLowerCase() || "";
        const composer = ps.piece?.composer?.toLowerCase() || "";
        const seriesTitle = ps.piece?.collection?.series?.title?.toLowerCase() || "";
        const collection = ps.piece?.collection?.title?.toLowerCase() || "";
        return title.includes(search) || composer.includes(search) || seriesTitle.includes(search) || collection.includes(search);
      });
    }

    if (selectedSeriesId !== "all") {
      filtered = filtered.filter((ps: any) => ps.piece?.collection?.series?.id === selectedSeriesId);
    }

    if (selectedCollectionId !== "all") {
      filtered = filtered.filter((ps: any) => ps.piece?.collection?.id === selectedCollectionId);
    }

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
        groups.set(pieceId, { piece: ps.piece, stages: [] });
      }
      groups.get(pieceId).stages.push(ps);
    });

    return Array.from(groups.values());
  }, [filteredPieceStages]);

  const handleDownload = async (pieceStageId: string, isBooked: boolean) => {
    if (isBooked && user) {
      const result = await getPieceStageSignedUrl(pieceStageId, "score");
      if ("error" in result && result.error) {
        toast.error(result.error);
      } else if (result.signedUrl) {
        window.open(result.signedUrl, "_blank");
      }
    } else {
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
      const result = await getPieceStageSignedUrl(pieceStageId, "audio");
      if ("error" in result && result.error) {
        toast.error(result.error);
      } else if (result.signedUrl) {
        window.open(result.signedUrl, "_blank");
      }
    } else {
      const ps = pieceStages.find((p) => p.id === pieceStageId);
      if (ps?.audio_url) {
        window.open(ps.audio_url, "_blank");
      } else {
        toast.error("Audio not available");
      }
    }
  };

  const getStageName = (stage: number) => {
    return stage === 1 ? "Stage 1 - Beginner" : stage === 2 ? "Stage 2 - Intermediate" : "Stage 3 - Advanced";
  };

  const getStageColor = (stage: number) => {
    return stage === 1 ? "bg-green-50 text-green-700 border-green-200" : stage === 2 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200";
  };

  const handleReset = () => {
    setSearchText("");
    setSelectedSeriesId("all");
    setSelectedCollectionId("all");
    setSelectedStage("all");
  };

  const hasActiveFilters = searchText || selectedSeriesId !== "all" || selectedCollectionId !== "all" || selectedStage !== "all";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white pt-16">
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="flex justify-center py-20">
            <div className="text-center">
              <div className="h-10 w-10 mx-auto mb-4 skeleton rounded-full" />
              <div className="h-4 w-32 mx-auto skeleton" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white pt-16">
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#7c3aed] flex items-center justify-center shadow-lg flex-shrink-0">
              <LibraryIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#7c3aed] bg-clip-text text-transparent mb-1">Music Library</h1>
              <p className="text-gray-500">Browse and discover pieces from our collection</p>
            </div>
          </div>
        </div>

        {/* Quick Access - Booked Pieces */}
        {user && bookedPieceStages.length > 0 && (
          <Card className="p-5 mb-6 bg-gradient-to-r from-blue-50/80 to-cyan-50/50 border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-[#2563EB]" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Your Booked Pieces</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookedPieceStages.map((ps: any) => (
                <Card key={ps.id} className="p-4 bg-white border border-blue-100 card-hover">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{ps.piece?.title}</h3>
                      {ps.piece?.composer && (
                        <p className="text-sm text-gray-500">{ps.piece.composer}</p>
                      )}
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getStageColor(ps.stage)}`}>
                      {getStageName(ps.stage)}
                    </span>
                  </div>

                  <div className="text-sm text-gray-500 mb-3">
                    <p>{new Date(ps.booking.concert.scheduled_date).toLocaleDateString()} &middot; {ps.booking.concert.venue?.name}</p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {ps.score_url && (
                      <Button variant="outline" size="sm" onClick={() => handleDownload(ps.id, true)} className="text-xs">
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        PDF
                      </Button>
                    )}
                    {ps.audio_url && (
                      <Button variant="outline" size="sm" onClick={() => handlePlayAudio(ps.id, true)} className="text-xs">
                        <Music className="w-3.5 h-3.5 mr-1.5" />
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
        <Card className="p-5 mb-6 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search pieces, composers..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10 h-10 bg-gray-50/50 border-gray-200 focus:border-[#8B5CF6] transition-colors"
                />
              </div>
            </div>

            {/* Series Filter */}
            <div>
              <Select value={selectedSeriesId} onValueChange={setSelectedSeriesId}>
                <SelectTrigger className="h-10 bg-gray-50/50 border-gray-200">
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
                <SelectTrigger className="h-10 bg-gray-50/50 border-gray-200">
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
                <SelectTrigger className="h-10 bg-gray-50/50 border-gray-200">
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

          <div className="mt-3 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {groupedPieces.length} piece{groupedPieces.length !== 1 ? "s" : ""} found
            </p>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-gray-500 hover:text-gray-700 gap-1.5">
                <X className="w-3.5 h-3.5" />
                Clear filters
              </Button>
            )}
          </div>
        </Card>

        {/* Library Grid */}
        {groupedPieces.length === 0 ? (
          <Card className="p-16 border border-gray-100">
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
                <LibraryIcon className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No pieces found</h3>
              <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or search terms.</p>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Clear all filters
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedPieces.map(({ piece, stages }: any) => (
              <Card key={piece.id} className="border border-gray-100 shadow-sm card-hover overflow-hidden">
                {/* Card header */}
                <div className="px-5 pt-5 pb-3">
                  <h3 className="font-semibold text-lg text-gray-900 mb-0.5">{piece.title}</h3>
                  {piece.composer && <p className="text-sm text-gray-500">{piece.composer}</p>}
                  {piece.year_composed && (
                    <p className="text-xs text-gray-400 mt-0.5">Composed {piece.year_composed}</p>
                  )}
                </div>

                <div className="px-5 pb-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="font-medium text-gray-500">
                      {piece.collection?.series?.title
                        ? piece.collection.series.title.charAt(0).toUpperCase() + piece.collection.series.title.slice(1)
                        : "N/A"}
                    </span>
                    <span>&middot;</span>
                    <span>{piece.collection?.title}</span>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 space-y-2">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Available Stages</p>
                  {stages.map((stage: any) => (
                    <div key={stage.id} className="rounded-xl bg-gray-50/80 border border-gray-100 p-3">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getStageColor(stage.stage)}`}>
                          {getStageName(stage.stage)}
                        </span>
                      </div>
                      {stage.notes && (
                        <p className="text-xs text-gray-500 mb-2 leading-relaxed">{stage.notes}</p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => stage.score_url && handleDownload(stage.id, false)}
                          disabled={!stage.score_url}
                          className="text-xs h-8 gap-1.5"
                        >
                          <Download className="w-3 h-3" />
                          PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => stage.audio_url && handlePlayAudio(stage.id, false)}
                          disabled={!stage.audio_url}
                          className="text-xs h-8 gap-1.5"
                        >
                          <Music className="w-3 h-3" />
                          Listen
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
