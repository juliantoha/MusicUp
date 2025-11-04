"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMyServiceHours, useMyPastConcerts } from "@/lib/hooks";
import { Clock, Music2 } from "lucide-react";

export function InformationTab() {
  const { data: serviceHours, loading: loadingHours } = useMyServiceHours();
  const { data: pastConcerts, loading: loadingConcerts } = useMyPastConcerts();

  // Calculate total hours
  const totalHours = serviceHours.reduce((sum, sh) => {
    if (sh.status === "approved") {
      return sum + sh.hours;
    }
    return sum;
  }, 0);

  const pendingHours = serviceHours.reduce((sum, sh) => {
    if (sh.status === "pending") {
      return sum + sh.hours;
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Volunteer Hours Summary */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold">Volunteer Hours</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Approved Hours</p>
            <p className="text-3xl font-bold text-green-600">{totalHours}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Pending Hours</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingHours}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Concerts</p>
            <p className="text-3xl font-bold text-blue-600">{pastConcerts.length}</p>
          </div>
        </div>

        {/* Service Hours Breakdown */}
        {loadingHours ? (
          <p className="text-center text-gray-500 py-4">Loading service hours...</p>
        ) : serviceHours.length > 0 ? (
          <div>
            <h4 className="font-medium mb-3">Hours Breakdown</h4>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Concert</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceHours.map((sh) => (
                    <TableRow key={sh.id}>
                      <TableCell>
                        {sh.concert?.scheduled_date &&
                          new Date(sh.concert.scheduled_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{sh.concert?.series?.name || "N/A"}</TableCell>
                      <TableCell>{sh.concert?.venue?.name || "N/A"}</TableCell>
                      <TableCell>{sh.hours}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            sh.status === "approved"
                              ? "default"
                              : sh.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {sh.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No service hours recorded yet.</p>
            <p className="text-sm mt-1">
              Complete concerts to start tracking your volunteer hours!
            </p>
          </div>
        )}
      </Card>

      {/* Past Concerts */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Music2 className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-semibold">Past Concerts</h3>
        </div>

        {loadingConcerts ? (
          <p className="text-center text-gray-500 py-4">Loading past concerts...</p>
        ) : pastConcerts.length > 0 ? (
          <div className="space-y-3">
            {pastConcerts.map((concert) => (
              <Card key={concert.id} className="p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{concert.series?.name}</h4>
                    <p className="text-sm text-gray-600">{concert.venue?.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(concert.scheduled_date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge>Completed</Badge>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No past concerts yet.</p>
            <p className="text-sm mt-1">Your completed performances will appear here!</p>
          </div>
        )}
      </Card>
    </div>
  );
}
