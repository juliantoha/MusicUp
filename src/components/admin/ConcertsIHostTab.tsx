"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useMyManagedConcerts } from "@/lib/hooks";
import { ConcertDetailView } from "./ConcertDetailView";
import { ArrowLeft, Calendar, ChevronRight } from "lucide-react";
import type { ConcertWithDetails } from "@/types/db";

export function ConcertsIHostTab() {
  const { data: concerts, loading, refetch } = useMyManagedConcerts();
  const [selectedConcert, setSelectedConcert] = useState<ConcertWithDetails | null>(null);

  if (selectedConcert) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setSelectedConcert(null)} className="border-gray-200">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Concerts
        </Button>
        <ConcertDetailView
          concert={selectedConcert}
          onUpdate={() => {
            refetch();
            setSelectedConcert(null);
          }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-48 skeleton rounded-lg" />
          <div className="h-4 w-80 skeleton rounded-lg" />
        </div>
        <Card className="overflow-hidden border border-gray-100">
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-12 flex-1 skeleton rounded-lg" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (concerts.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No Upcoming Concerts</h3>
        <p className="text-sm text-gray-500">
          You don't have any scheduled concerts at your venues yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Upcoming Concerts</h3>
        <p className="text-sm text-gray-500 mb-4">
          Click on a concert to manage performers and complete the event.
        </p>
      </div>

      <Card className="overflow-hidden border border-gray-100">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
              <TableHead className="font-semibold text-gray-700">Where</TableHead>
              <TableHead className="font-semibold text-gray-700">When</TableHead>
              <TableHead className="font-semibold text-gray-700">Who</TableHead>
              <TableHead className="font-semibold text-gray-700">What</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {concerts.map((concert) => {
              const bookingsCount = concert.bookings?.length || 0;
              const performers = concert.bookings
                ?.map((b: any) => b.performer?.full_name)
                .filter(Boolean)
                .slice(0, 3);

              return (
                <TableRow
                  key={concert.id}
                  className="cursor-pointer hover:bg-blue-50/40 transition-colors"
                  onClick={() => setSelectedConcert(concert)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{concert.venue?.name}</p>
                      <p className="text-sm text-gray-500">
                        {concert.venue?.city}, {concert.venue?.state}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(concert.starts_at).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          timeZone: "America/Los_Angeles",
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
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
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{bookingsCount} performer{bookingsCount !== 1 ? "s" : ""}</p>
                      {performers && performers.length > 0 && (
                        <p className="text-sm text-gray-500">
                          {performers.join(", ")}
                          {bookingsCount > 3 && ` +${bookingsCount - 3} more`}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-900">{concert.series?.title}</p>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-600">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
