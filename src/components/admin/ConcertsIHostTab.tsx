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
import { ArrowLeft, Calendar } from "lucide-react";
import type { ConcertWithDetails } from "@/types/db";

export function ConcertsIHostTab() {
  const { data: concerts, loading, refetch } = useMyManagedConcerts();
  const [selectedConcert, setSelectedConcert] = useState<ConcertWithDetails | null>(null);

  if (selectedConcert) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setSelectedConcert(null)}>
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
      <div className="flex justify-center py-8">
        <p className="text-gray-500">Loading concerts...</p>
      </div>
    );
  }

  if (concerts.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center text-gray-500">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Upcoming Concerts</h3>
          <p className="text-sm">
            You don't have any scheduled concerts at your venues yet.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Upcoming Concerts</h3>
        <p className="text-sm text-gray-600 mb-4">
          Click on a concert to manage performers and complete the event.
        </p>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Where</TableHead>
              <TableHead>When</TableHead>
              <TableHead>Who</TableHead>
              <TableHead>What</TableHead>
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
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedConcert(concert)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{concert.venue?.name}</p>
                      <p className="text-sm text-gray-600">
                        {concert.venue?.city}, {concert.venue?.state}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {new Date(concert.scheduled_date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      {concert.start_time && (
                        <p className="text-sm text-gray-600">
                          {concert.start_time}
                          {concert.end_time && ` - ${concert.end_time}`}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{bookingsCount} performers</p>
                      {performers && performers.length > 0 && (
                        <p className="text-sm text-gray-600">
                          {performers.join(", ")}
                          {bookingsCount > 3 && ` +${bookingsCount - 3} more`}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{concert.series?.name}</p>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Manage
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
