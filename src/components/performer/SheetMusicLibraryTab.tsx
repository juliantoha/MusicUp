"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSeries, useCollections, usePieces, useStages } from "@/lib/hooks";
import { Download, Music, Library } from "lucide-react";

export function SheetMusicLibraryTab() {
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const [selectedPieceId, setSelectedPieceId] = useState<string>("");

  const { data: seriesList } = useSeries();
  const { data: collections } = useCollections(selectedSeriesId);
  const { data: pieces } = usePieces(selectedCollectionId);
  const { data: stages } = useStages(selectedPieceId);

  // Find selected items for display
  const selectedSeries = seriesList.find((s) => s.id === selectedSeriesId);
  const selectedCollection = collections.find((c) => c.id === selectedCollectionId);
  const selectedPiece = pieces.find((p) => p.id === selectedPieceId);

  const getStageBorderColor = (stage: number) => {
    switch (stage) {
      case 1:
        return "border-l-green-500";
      case 2:
        return "border-l-amber-500";
      case 3:
        return "border-l-red-500";
      default:
        return "border-l-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <Library className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Sheet Music Library</h3>
          <p className="text-sm text-gray-600">
            Browse and access practice materials for all available pieces.
          </p>
        </div>
      </div>

      {/* Selection Filters */}
      <Card className="p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Series Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Series</label>
            <Select
              value={selectedSeriesId}
              onValueChange={(value) => {
                setSelectedSeriesId(value);
                setSelectedCollectionId("");
                setSelectedPieceId("");
              }}
            >
              <SelectTrigger className="h-10 border-gray-200 bg-white focus:border-[#2563EB] transition-colors">
                <SelectValue placeholder="Select series" />
              </SelectTrigger>
              <SelectContent>
                {seriesList.map((series) => (
                  <SelectItem key={series.id} value={series.id}>
                    {series.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Collection Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Collection</label>
            <Select
              value={selectedCollectionId}
              onValueChange={(value) => {
                setSelectedCollectionId(value);
                setSelectedPieceId("");
              }}
              disabled={!selectedSeriesId}
            >
              <SelectTrigger className={`h-10 border-gray-200 bg-white focus:border-[#2563EB] transition-colors ${!selectedSeriesId ? "bg-gray-50/80" : ""}`}>
                <SelectValue placeholder="Select collection" />
              </SelectTrigger>
              <SelectContent>
                {collections.map((collection) => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Piece Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Piece</label>
            <Select
              value={selectedPieceId}
              onValueChange={setSelectedPieceId}
              disabled={!selectedCollectionId}
            >
              <SelectTrigger className={`h-10 border-gray-200 bg-white focus:border-[#2563EB] transition-colors ${!selectedCollectionId ? "bg-gray-50/80" : ""}`}>
                <SelectValue placeholder="Select piece" />
              </SelectTrigger>
              <SelectContent>
                {pieces.map((piece) => (
                  <SelectItem key={piece.id} value={piece.id}>
                    {piece.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Series Description */}
      {selectedSeries && (
        <Card className="p-4 border-l-4 border-l-blue-500 bg-white border border-gray-100">
          <h4 className="font-semibold mb-2">{selectedSeries.title}</h4>
          {selectedSeries.description && (
            <p className="text-sm text-gray-700">{selectedSeries.description}</p>
          )}
        </Card>
      )}

      {/* Piece Details & Stages */}
      {selectedPiece && (
        <Card className="p-6 card-hover">
          <div className="flex gap-4 mb-4">
            {/* Album Cover / Thumbnail */}
            {selectedPiece.image_url && (
              <div className="flex-shrink-0">
                <img
                  src={selectedPiece.image_url}
                  alt={`${selectedPiece.title} cover`}
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
            {/* Piece Info */}
            <div className="flex-1">
              <h4 className="text-lg font-semibold">{selectedPiece.title}</h4>
              {selectedPiece.composer && (
                <p className="text-gray-600">Composer: {selectedPiece.composer}</p>
              )}
              {selectedPiece.year_composed && (
                <p className="text-gray-600">Year: {selectedPiece.year_composed}</p>
              )}
            </div>
          </div>

          {stages.length > 0 ? (
            <div className="space-y-3">
              <h5 className="font-medium">Available Difficulty Levels</h5>
              {stages.map((stage) => (
                <Card key={stage.id} className={`p-4 border-l-4 ${getStageBorderColor(stage.stage)} bg-white border border-gray-100`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h6 className="font-medium">
                        {stage.stage === 1 && "Stage 1 - Beginner"}
                        {stage.stage === 2 && "Stage 2 - Intermediate"}
                        {stage.stage === 3 && "Stage 3 - Advanced"}
                      </h6>
                      {stage.notes && (
                        <p className="text-sm text-gray-600 mt-1">{stage.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {stage.score_url ? (
                      <Button variant="outline" size="sm" className="rounded-xl border-gray-200" asChild>
                        <a href={stage.score_url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          Download Sheet Music
                        </a>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="rounded-xl border-gray-200" disabled>
                        <Download className="w-4 h-4 mr-2" />
                        Sheet Music Unavailable
                      </Button>
                    )}
                    {stage.audio_url ? (
                      <Button variant="outline" size="sm" className="rounded-xl border-gray-200" asChild>
                        <a href={stage.audio_url} target="_blank" rel="noopener noreferrer">
                          <Music className="w-4 h-4 mr-2" />
                          Listen to Song
                        </a>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="rounded-xl border-gray-200" disabled>
                        <Music className="w-4 h-4 mr-2" />
                        Audio Unavailable
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No stages available for this piece yet.
            </p>
          )}
        </Card>
      )}

      {/* Empty State */}
      {!selectedSeriesId && (
        <Card className="p-12">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Library className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="font-medium mb-2">Browse the Music Library</h4>
            <p className="text-sm mb-6">
              Select a series above to start exploring available pieces and practice materials.
            </p>
            {/* Skeleton loading indicator */}
            <div className="max-w-md mx-auto space-y-3">
              <div className="flex gap-3">
                <div className="h-10 flex-1 rounded-lg bg-gray-100 animate-pulse" />
                <div className="h-10 flex-1 rounded-lg bg-gray-100 animate-pulse" />
              </div>
              <div className="h-24 w-full rounded-lg bg-gray-50 animate-pulse" />
              <div className="flex gap-3">
                <div className="h-8 w-28 rounded-lg bg-gray-50 animate-pulse" />
                <div className="h-8 w-28 rounded-lg bg-gray-50 animate-pulse" />
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
