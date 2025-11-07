"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { withRole } from "@/lib/auth/withRole";
import { useSeries, useCollections, usePieces, useStages } from "@/lib/hooks";
import { uploadScore, uploadAudio, getPieceStageDetails } from "@/lib/storage/actions";
import { Upload, FileText, Music, CheckCircle2 } from "lucide-react";

function LibraryUploadPage() {
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const [selectedPieceId, setSelectedPieceId] = useState<string>("");
  const [selectedStageId, setSelectedStageId] = useState<string>("");

  const [scoreFile, setScoreFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const [uploadingScore, setUploadingScore] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);

  const [scoreUrl, setScoreUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const { data: seriesList } = useSeries();
  const { data: collections } = useCollections(selectedSeriesId);
  const { data: pieces } = usePieces(selectedCollectionId);
  const { data: stages } = useStages(selectedPieceId);

  const selectedSeries = seriesList.find((s) => s.id === selectedSeriesId);
  const selectedCollection = collections.find((c) => c.id === selectedCollectionId);
  const selectedPiece = pieces.find((p) => p.id === selectedPieceId);
  const selectedStage = stages.find((s) => s.id === selectedStageId);

  const handleScoreUpload = async () => {
    if (!scoreFile || !selectedStageId) {
      toast.error("Please select a PDF file and choose a stage");
      return;
    }

    setUploadingScore(true);

    try {
      // Get piece stage details for path generation
      const details = await getPieceStageDetails(selectedStageId);

      if ("error" in details) {
        toast.error(details.error);
        setUploadingScore(false);
        return;
      }

      if (!("seriesSlug" in details)) {
        toast.error("Failed to get piece details");
        setUploadingScore(false);
        return;
      }

      // Create form data
      const formData = new FormData();
      formData.append("piece_stage_id", selectedStageId);
      formData.append("series_slug", details.seriesSlug);
      formData.append("collection_id", details.collectionId);
      formData.append("piece_id", details.pieceId);
      formData.append("stage", selectedStage?.stage?.toString() || "1");
      formData.append("file", scoreFile);

      const result = await uploadScore(formData);

      if ("error" in result) {
        toast.error(result.error);
      } else if ("success" in result && result.success && "url" in result && result.url) {
        toast.success("Score uploaded successfully!");
        setScoreUrl(result.url);
        setScoreFile(null);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload score");
    }

    setUploadingScore(false);
  };

  const handleAudioUpload = async () => {
    if (!audioFile || !selectedStageId) {
      toast.error("Please select an audio file and choose a stage");
      return;
    }

    setUploadingAudio(true);

    try {
      // Get piece stage details for path generation
      const details = await getPieceStageDetails(selectedStageId);

      if ("error" in details) {
        toast.error(details.error);
        setUploadingAudio(false);
        return;
      }

      if (!("seriesSlug" in details)) {
        toast.error("Failed to get piece details");
        setUploadingAudio(false);
        return;
      }

      // Create form data
      const formData = new FormData();
      formData.append("piece_stage_id", selectedStageId);
      formData.append("series_slug", details.seriesSlug);
      formData.append("collection_id", details.collectionId);
      formData.append("piece_id", details.pieceId);
      formData.append("stage", selectedStage?.stage?.toString() || "1");
      formData.append("file", audioFile);

      const result = await uploadAudio(formData);

      if ("error" in result) {
        toast.error(result.error);
      } else if ("success" in result && result.success && "url" in result && result.url) {
        toast.success("Audio uploaded successfully!");
        setAudioUrl(result.url);
        setAudioFile(null);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload audio");
    }

    setUploadingAudio(false);
  };

  const handleReset = () => {
    setSelectedSeriesId("");
    setSelectedCollectionId("");
    setSelectedPieceId("");
    setSelectedStageId("");
    setScoreFile(null);
    setAudioFile(null);
    setScoreUrl(null);
    setAudioUrl(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Library Upload Utility</h1>
        <p className="text-gray-600">Upload scores and audio files to the music library</p>
      </div>

      {/* Selection */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Select Piece & Stage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Series Select */}
          <div>
            <label className="block text-sm font-medium mb-2">Series</label>
            <Select
              value={selectedSeriesId}
              onValueChange={(value) => {
                setSelectedSeriesId(value);
                setSelectedCollectionId("");
                setSelectedPieceId("");
                setSelectedStageId("");
                setScoreUrl(null);
                setAudioUrl(null);
              }}
            >
              <SelectTrigger>
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
            <label className="block text-sm font-medium mb-2">Collection</label>
            <Select
              value={selectedCollectionId}
              onValueChange={(value) => {
                setSelectedCollectionId(value);
                setSelectedPieceId("");
                setSelectedStageId("");
                setScoreUrl(null);
                setAudioUrl(null);
              }}
              disabled={!selectedSeriesId}
            >
              <SelectTrigger>
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
            <label className="block text-sm font-medium mb-2">Piece</label>
            <Select
              value={selectedPieceId}
              onValueChange={(value) => {
                setSelectedPieceId(value);
                setSelectedStageId("");
                setScoreUrl(null);
                setAudioUrl(null);
              }}
              disabled={!selectedCollectionId}
            >
              <SelectTrigger>
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

          {/* Stage Select */}
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty Stage</label>
            <Select
              value={selectedStageId}
              onValueChange={(value) => {
                setSelectedStageId(value);
                // Load existing URLs if available
                const stage = stages.find((s) => s.id === value);
                setScoreUrl(stage?.score_url || null);
                setAudioUrl(stage?.audio_url || null);
              }}
              disabled={!selectedPieceId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                {stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.stage === 1 && "Stage 1 - Beginner"}
                    {stage.stage === 2 && "Stage 2 - Intermediate"}
                    {stage.stage === 3 && "Stage 3 - Advanced"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedStage && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium mb-1">Selected:</p>
            <p className="text-sm text-gray-700">
              {selectedSeries?.title} → {selectedCollection?.title} → {selectedPiece?.title} →{" "}
              {selectedStage.stage === 1 && "Stage 1"}
              {selectedStage.stage === 2 && "Stage 2"}
              {selectedStage.stage === 3 && "Stage 3"}
            </p>
          </div>
        )}
      </Card>

      {/* Upload Score */}
      {selectedStageId && (
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold">Upload Score (PDF)</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => setScoreFile(e.target.files?.[0] || null)}
              />
              <p className="text-sm text-gray-500 mt-1">PDF file, max 10MB</p>
            </div>

            <Button onClick={handleScoreUpload} disabled={!scoreFile || uploadingScore}>
              <Upload className="w-4 h-4 mr-2" />
              {uploadingScore ? "Uploading..." : "Upload Score"}
            </Button>

            {scoreUrl && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">Score uploaded successfully</p>
                  <a
                    href={scoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Score
                  </a>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Upload Audio */}
      {selectedStageId && (
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Music className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold">Upload Audio</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              />
              <p className="text-sm text-gray-500 mt-1">MP3, WAV, or other audio formats, max 20MB</p>
            </div>

            <Button onClick={handleAudioUpload} disabled={!audioFile || uploadingAudio}>
              <Upload className="w-4 h-4 mr-2" />
              {uploadingAudio ? "Uploading..." : "Upload Audio"}
            </Button>

            {audioUrl && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">Audio uploaded successfully</p>
                  <a
                    href={audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Play Audio
                  </a>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}

export default withRole(LibraryUploadPage, ["admin", "super_admin"]);
