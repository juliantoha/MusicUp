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
import { useVenues, useSeries, useCollections, usePieces, useStages, useUpcomingConcerts, useUnsignedWaivers } from "@/lib/hooks";
import { createBooking } from "@/lib/bookings/actions";
import { formatPacificDate, formatPacificTimeRange } from "@/lib/utils";
import { MapPin, Calendar, Music, Check, Loader2, ChevronLeft, ChevronRight, RotateCcw, User } from "lucide-react";
import Image from "next/image";
import type { Concert } from "@/types/db";
import { booking as copy, emptyStates } from "@/lib/copy";
import { VenueTypeBadge } from "@/components/ui/VenueTypeBadge";
import { VenueLocationMap } from "@/components/VenueLocationMap";
import { WaiverSigningPanel } from "@/components/WaiverSigningPanel";

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
  const [waiversCleared, setWaiversCleared] = useState(false);

  const { data: venues } = useVenues();
  const { data: upcomingConcerts } = useUpcomingConcerts(selectedVenueId);
  const { data: unsignedWaivers, loading: loadingWaivers, refetch: refetchWaivers } = useUnsignedWaivers(selectedVenueId);
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
    if (currentStep === 0 && unsignedWaivers.length > 0 && !waiversCleared) {
      toast.error("Please sign all required waivers before proceeding");
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
    setWaiversCleared(false);
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
      {/* Stepper */}
      <div className="relative flex items-start justify-between gap-0">
        {/* Connector line behind circles */}
        <div className="absolute top-6 md:top-7 left-0 right-0 flex items-center px-[3rem] md:px-[4rem]" aria-hidden="true">
          <div className="w-full h-0.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563EB] transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {STEPS.map((step, index) => {
          const Icon = STEP_ICONS[index];
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center flex-1">
              <div
                className={`relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl border-2 transition-all duration-300 ${
                  isCompleted
                    ? "border-[#2563EB] bg-[#2563EB] text-white shadow-md shadow-blue-200"
                    : isActive
                    ? "border-[#2563EB] bg-blue-50 text-[#2563EB] shadow-md shadow-blue-100"
                    : "border-gray-200 bg-white text-gray-400"
                }`}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Step ${index + 1}: ${step}`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
                ) : (
                  <Icon className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
                )}
              </div>
              <span
                className={`mt-2.5 text-xs md:text-sm font-medium text-center transition-colors duration-300 ${
                  isCompleted
                    ? "text-[#2563EB]"
                    : isActive
                    ? "text-gray-900 font-semibold"
                    : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="p-6 border border-gray-100 shadow-sm">
        {currentStep === 0 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Choose a Venue</h3>
              <p className="text-sm text-gray-500">
                Select the location where you'd like to perform.
              </p>
            </div>
            <Select value={selectedVenueId} onValueChange={setSelectedVenueId}>
              <SelectTrigger className="h-11 border-gray-200 bg-white focus:border-[#2563EB] transition-colors">
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
            {selectedVenueId && (() => {
              const selectedVenue = venues.find((v: any) => v.id === selectedVenueId);
              if (!selectedVenue) return null;

              const hasPhotos = selectedVenue.exterior_photo_url || selectedVenue.interior_photo_url;

              return (
                <div className="mt-4 space-y-4">
                  {/* Venue Detail Card */}
                  <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                    {/* Photos + Map Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                      {/* Venue Photos */}
                      {hasPhotos && (
                        <div className={`grid ${selectedVenue.exterior_photo_url && selectedVenue.interior_photo_url ? "grid-cols-2" : "grid-cols-1"} ${hasPhotos ? "md:col-span-2" : ""}`}>
                          {selectedVenue.exterior_photo_url && (
                            <div className="relative aspect-[4/3]">
                              <Image
                                src={selectedVenue.exterior_photo_url}
                                alt={`${selectedVenue.name} exterior`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, 33vw"
                              />
                              <span className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md">
                                Exterior
                              </span>
                            </div>
                          )}
                          {selectedVenue.interior_photo_url && (
                            <div className="relative aspect-[4/3]">
                              <Image
                                src={selectedVenue.interior_photo_url}
                                alt={`${selectedVenue.name} interior`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, 33vw"
                              />
                              <span className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md">
                                Interior
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Map */}
                      <div className={hasPhotos ? "md:col-span-1" : "md:col-span-3"}>
                        <VenueLocationMap
                          address={selectedVenue.address}
                          city={selectedVenue.city}
                          state={selectedVenue.state}
                          zip={selectedVenue.zip}
                          latitude={selectedVenue.latitude}
                          longitude={selectedVenue.longitude}
                          venueName={selectedVenue.name}
                          className="h-full [&>div]:rounded-none [&>div]:border-0 [&>div>div]:rounded-none [&_iframe]:h-full [&_iframe]:min-h-[160px]"
                        />
                      </div>
                    </div>

                    {/* Venue Info Bar */}
                    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {selectedVenue.address}, {selectedVenue.city}, {selectedVenue.state} {selectedVenue.zip}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {selectedVenue.venue_type && (
                              <VenueTypeBadge venueType={selectedVenue.venue_type} />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Host Info */}
                      {selectedVenue.venue_contact_name && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Host</p>
                            <p className="text-sm font-medium text-gray-700">{selectedVenue.venue_contact_name}</p>
                          </div>
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Waiver Signing Section */}
                  {!loadingWaivers && unsignedWaivers.length > 0 && !waiversCleared && (
                    <div className="mt-4">
                      <WaiverSigningPanel
                        waivers={unsignedWaivers}
                        venueName={selectedVenue.name}
                        onAllSigned={() => {
                          setWaiversCleared(true);
                          refetchWaivers();
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })()}
            {venues.length === 0 && (
              <div className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <MapPin className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-500">No venues available</p>
              </div>
            )}
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Select a Concert</h3>
              <p className="text-sm text-gray-500">
                Choose a concert series that fits this venue. Only series appropriate for {venues.find((v) => v.id === selectedVenueId)?.name} are shown.
              </p>
            </div>
            {upcomingConcerts.length > 0 ? (
              <div className="space-y-2">
                {upcomingConcerts.map((concert) => (
                  <div
                    key={concert.id}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedConcert?.id === concert.id
                        ? "border-[#2563EB] bg-blue-50/60 shadow-sm"
                        : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => setSelectedConcert(concert)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{concert.series?.title}</p>
                        {concert.series?.tagline && (
                          <p className="text-xs text-gray-500 italic mt-0.5">{concert.series.tagline}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {formatPacificDate(concert.starts_at)}
                          </span>
                          <span className="text-sm text-gray-600">
                            {formatPacificTimeRange(concert.starts_at, concert.ends_at)}
                          </span>
                        </div>
                      </div>
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedConcert?.id === concert.id
                          ? "border-[#2563EB] bg-[#2563EB]"
                          : "border-gray-300 bg-white"
                      }`}>
                        {selectedConcert?.id === concert.id && (
                          <Check className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm font-medium text-gray-600">{emptyStates.noConcerts.message}</p>
                <p className="text-xs text-gray-400 mt-1">{emptyStates.noConcerts.hint}</p>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Pick Your Piece</h3>
              <p className="text-sm text-gray-500">
                Choose the song and difficulty level you'd like to perform.
              </p>
            </div>

            {/* Series Select - Auto-populated from concert */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Series</label>
              <Select value={selectedSeriesId} onValueChange={setSelectedSeriesId} disabled>
                <SelectTrigger className="h-11 border-gray-200 bg-gray-50/80 transition-colors">
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Collection</label>
                <Select value={selectedCollectionId} onValueChange={setSelectedCollectionId}>
                  <SelectTrigger className="h-11 border-gray-200 bg-white focus:border-[#2563EB] transition-colors">
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Piece</label>
                <Select value={selectedPieceId} onValueChange={setSelectedPieceId}>
                  <SelectTrigger className="h-11 border-gray-200 bg-white focus:border-[#2563EB] transition-colors">
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Difficulty Level</label>
                <Select value={selectedStageId} onValueChange={setSelectedStageId}>
                  <SelectTrigger className="h-11 border-gray-200 bg-white focus:border-[#2563EB] transition-colors">
                    <SelectValue>
                      {selectedStageId
                        ? (() => {
                            const selectedStage = stages.find(s => s.id === selectedStageId);
                            if (!selectedStage) return "Select difficulty";
                            return selectedStage.stage === 1 ? "Stage 1" :
                                   selectedStage.stage === 2 ? "Stage 2" :
                                   selectedStage.stage === 3 ? "Stage 3" : "Select difficulty";
                          })()
                        : "Select difficulty"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => {
                      const stageLabel =
                        stage.stage === 1 ? "Stage 1" :
                        stage.stage === 2 ? "Stage 2" :
                        stage.stage === 3 ? "Stage 3" : "Unknown";

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
      <div className="flex justify-between items-center">
        <div>
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack} className="h-10 border-gray-200">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleReset} size="sm" className="h-10 text-gray-500 hover:text-gray-700">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset
          </Button>
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNext} className="h-10 shadow-md hover:shadow-lg transition-all">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="h-10 shadow-md hover:shadow-lg transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                "Book Concert"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
