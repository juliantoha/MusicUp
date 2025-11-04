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
import { toast } from "sonner";
import { useVenues, useSeries, useCollections, usePieces, useStages, useUpcomingConcerts } from "@/lib/hooks";
import { createBooking } from "@/lib/bookings/actions";
import type { Concert } from "@/types/db";

const STEPS = ["Choose Location", "Select Concert", "Pick Your Piece"];

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

  const handleNext = () => {
    if (currentStep === 0 && !selectedVenueId) {
      toast.error("Please select a venue");
      return;
    }
    if (currentStep === 1 && !selectedConcert) {
      toast.error("Please select a concert");
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
      toast.error("Please complete all selections");
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
        toast.success("Concert booked successfully! 🎵");
        handleReset();
      }
    } catch (error) {
      toast.error("Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    selectedConcert && selectedSeriesId && selectedCollectionId && selectedPieceId && selectedStageId;

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index <= currentStep
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  index <= currentStep ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-4 ${
                  index < currentStep ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
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
                        <p className="font-medium">{concert.series?.name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(concert.scheduled_date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        {concert.start_time && (
                          <p className="text-sm text-gray-600">
                            {concert.start_time}
                            {concert.end_time && ` - ${concert.end_time}`}
                          </p>
                        )}
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
                <p>No upcoming concerts scheduled at this venue.</p>
                <p className="text-sm mt-2">Please select a different venue or check back later.</p>
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

            {/* Series Select */}
            <div>
              <label className="block text-sm font-medium mb-2">Series</label>
              <Select value={selectedSeriesId} onValueChange={setSelectedSeriesId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select series" />
                </SelectTrigger>
                <SelectContent>
                  {seriesList.map((series) => (
                    <SelectItem key={series.id} value={series.id}>
                      {series.name}
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
                        {collection.name}
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
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.stage === "stage_1" && "Stage 1 - Beginner"}
                        {stage.stage === "stage_2" && "Stage 2 - Intermediate"}
                        {stage.stage === "stage_3" && "Stage 3 - Advanced"}
                      </SelectItem>
                    ))}
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
