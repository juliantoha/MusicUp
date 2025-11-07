"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useVenues, useSeries, useCollections, usePieces, useStages, useUpcomingConcerts } from "@/lib/hooks";
import { createBooking } from "@/lib/bookings/actions";
import { MapPin, Calendar, Music, Check } from "lucide-react";
import type { Concert } from "@/types/db";
import { booking as copy, emptyStates } from "@/lib/copy";

const STEP_ICONS = [MapPin, Calendar, Music];

const STEPS = copy.steps.labels;

export function BookConcertTab() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedVenueId, setSelectedVenueId] = useState<string>("");
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const [selectedPieceId, setSelectedPieceId] = useState<string>("");
  const [selectedStageId, setSelectedStageId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: venues } = useVenues();
  const { data: upcomingConcerts } = useUpcomingConcerts(selectedVenueId);
  const { data: seriesList } = useSeries();
  const { data: collections } = useCollections(selectedSeriesId);
  const { data: pieces } = usePieces(selectedCollectionId);
  const { data: stages } = useStages(selectedPieceId);

  // Auto-populate series when concert is selected
  useEffect(() => {
    if (selectedConcert?.series_id) {
      setSelectedSeriesId(selectedConcert.series_id);
    }
  }, [selectedConcert]);

  const handleNext = () => {
    if (currentStep === 0 && !selectedVenueId) {
      toast.error(copy.validation.selectVenue);
      return;
    }
    if (currentStep === 1 && !selectedConcert) {
      toast.error(copy.validation.selectConcert);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedVenueId("");
    setSelectedConcert(null);
    setSelectedSeriesId("");
    setSelectedCollectionId("");
    setSelectedPieceId("");
    setSelectedStageId("");
  };

  const handleSubmit = async () => {
    if (!selectedConcert || !selectedStageId) {
      toast.error(copy.validation.completeSelections);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createBooking({
        concert_id: selectedConcert.id,
        piece_stage_id: selectedStageId,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(copy.success.created);
        handleReset();
      }
    } catch (error) {
      toast.error(copy.errors.failed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    selectedConcert && selectedSeriesId && selectedCollectionId && selectedPieceId && selectedStageId;

  return (
    <div className="space-y-6">
      {/* Stepper - Mobile-First Design */}
      <div className="flex items-start md:items-center justify-between gap-2">
        {STEPS.map((step, index) => {
          const Icon = STEP_ICONS[index];
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border-2 transition-all ${
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`Step ${index + 1}: ${step}`}
                >
                  {/* Step Number Badge */}
                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCompleted || isActive
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-300 text-gray-600"
                  }`}>
                    {index + 1}
                  </div>
                  {/* Icon */}
                  {isCompleted ? (
                    <Check className="w-6 h-6 md:w-7 md:h-7" aria-hidden="true" />
                  ) : (
                    <Icon className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
                  )}
                </div>
                <span
                  className={`mt-2 text-xs md:text-sm font-medium text-center transition-colors ${
                    isActive || isCompleted ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-full max-w-[2rem] md:max-w-[4rem] mx-1 md:mx-4 transition-colors ${
                    index < currentStep ? "bg-primary" : "bg-border"
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="p-6">
        {currentStep === 0 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Choose a Venue</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select the location where you'd like to perform.
              </p>
            </div>
            <Select value={selectedVenueId} onValueChange={setSelectedVenueId}>
              <SelectTrigger>
                <SelectValue placeholder="Select venue" />
              </SelectTrigger>
              <SelectContent>
                {venues.map((venue) => (
                  <SelectItem key={venue.id} value={venue.id}>
                    {venue.name} - {venue.city}, {venue.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {venues.length === 0 && (
              <p className="text-sm text-gray-500">No venues available</p>
            )}
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select a Concert</h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose a scheduled concert at {venues.find((v) => v.id === selectedVenueId)?.name}.
              </p>
            </div>
            {upcomingConcerts.length > 0 ? (
              <div className="space-y-2">
                {upcomingConcerts.map((concert) => (
                  <Card
                    key={concert.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedConcert?.id === concert.id
                        ? "border-blue-600 bg-blue-50"
                        : "hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedConcert(concert)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{concert.series?.title}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(concert.starts_at).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            timeZone: "America/Los_Angeles",
                          })}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(concert.starts_at).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                            timeZone: "America/Los_Angeles",
                          })}
                          {" - "}
                          {new Date(concert.ends_at).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                            timeZone: "America/Los_Angeles",
                          })}
                          {" PT"}
                        </p>
                      </div>
                      {selectedConcert?.id === concert.id && (
                        <div className="text-blue-600">✓</div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>{emptyStates.noConcerts.message}</p>
                <p className="text-sm mt-2">{emptyStates.noConcerts.hint}</p>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Pick Your Piece</h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose the song and difficulty level you'd like to perform.
              </p>
            </div>

            {/* Series Select - Auto-populated from concert */}
            <div>
              <label className="block text-sm font-medium mb-2">Series</label>
              <Select value={selectedSeriesId} onValueChange={setSelectedSeriesId} disabled>
                <SelectTrigger>
                  <SelectValue>
                    {seriesList.find(s => s.id === selectedSeriesId)?.title || "Select series"}
                  </SelectValue>
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
            {selectedSeriesId && (
              <div>
                <label className="block text-sm font-medium mb-2">Collection</label>
                <Select value={selectedCollectionId} onValueChange={setSelectedCollectionId}>
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
            )}

            {/* Piece Select */}
            {selectedCollectionId && (
              <div>
                <label className="block text-sm font-medium mb-2">Piece</label>
                <Select value={selectedPieceId} onValueChange={setSelectedPieceId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select piece" />
                  </SelectTrigger>
                  <SelectContent>
                    {pieces.map((piece) => (
                      <SelectItem key={piece.id} value={piece.id}>
                        {piece.title}
                        {piece.composer && ` - ${piece.composer}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Stage Select */}
            {selectedPieceId && (
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                <Select value={selectedStageId} onValueChange={setSelectedStageId}>
                  <SelectTrigger>
                    <SelectValue>
                      {selectedStageId
                        ? (() => {
                            const selectedStage = stages.find(s => s.id === selectedStageId);
                            if (!selectedStage) return "Select difficulty";
                            return selectedStage.stage === "stage_1" ? "Stage 1" :
                                   selectedStage.stage === "stage_2" ? "Stage 2" :
                                   selectedStage.stage === "stage_3" ? "Stage 3" : "Select difficulty";
                          })()
                        : "Select difficulty"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => {
                      const stageLabel =
                        stage.stage === "stage_1" ? "Stage 1" :
                        stage.stage === "stage_2" ? "Stage 2" :
                        stage.stage === "stage_3" ? "Stage 3" : "Unknown";

                      return (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stageLabel}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <div>
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Booking..." : "Book Concert"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
