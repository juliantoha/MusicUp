"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMyServiceHours, useMyPastConcerts } from "@/lib/hooks";
import { Clock, Music2, Download } from "lucide-react";
import type { ServiceHourWithDetails } from "@/types/db";

// Helper function to group service hours by year
function groupServiceHoursByYear(serviceHours: ServiceHourWithDetails[]) {
  const yearGroups: { [year: string]: ServiceHourWithDetails[] } = {};

  serviceHours.forEach((sh) => {
    if (sh.concert?.scheduled_date) {
      const year = new Date(sh.concert.scheduled_date).getFullYear().toString();
      if (!yearGroups[year]) {
        yearGroups[year] = [];
      }
      yearGroups[year].push(sh);
    }
  });

  return yearGroups;
}

// Helper function to calculate hours total for a set of service hours
function calculateHoursTotal(hours: ServiceHourWithDetails[]) {
  return hours.reduce((sum, sh) => sum + sh.hours, 0);
}

// Helper function to export service hours to CSV
function exportToCSV(serviceHours: ServiceHourWithDetails[]) {
  // Define CSV headers
  const headers = ["Date", "Venue", "Series", "Hours", "Concert ID", "Admin"];

  // Map service hours to CSV rows
  const rows = serviceHours.map((sh) => [
    sh.concert?.scheduled_date
      ? new Date(sh.concert.scheduled_date).toLocaleDateString("en-US")
      : "N/A",
    sh.concert?.venue?.name || "N/A",
    sh.concert?.series?.name || "N/A",
    sh.hours.toString(),
    sh.concert_id || "N/A",
    sh.approver?.full_name || sh.approver?.email || "N/A",
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `service_hours_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function InformationTab() {
  const { data: serviceHours, loading: loadingHours } = useMyServiceHours();
  const { data: pastConcerts, loading: loadingConcerts } = useMyPastConcerts();

  // Group service hours by year
  const yearGroups = groupServiceHoursByYear(serviceHours);
  const years = Object.keys(yearGroups).sort((a, b) => parseInt(b) - parseInt(a));

  // Calculate totals
  const allTimeTotal = calculateHoursTotal(serviceHours);

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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold">Volunteer Hours</h3>
          </div>
          {serviceHours.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => exportToCSV(serviceHours)}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">All-Time Total</p>
            <p className="text-3xl font-bold text-green-600">{allTimeTotal.toFixed(1)}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Pending Hours</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingHours.toFixed(1)}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Concerts</p>
            <p className="text-3xl font-bold text-blue-600">{pastConcerts.length}</p>
          </div>
        </div>

        {/* Service Hours Breakdown by Year */}
        {loadingHours ? (
          <p className="text-center text-gray-500 py-4">Loading service hours...</p>
        ) : serviceHours.length > 0 ? (
          <div className="space-y-6">
            <h4 className="font-medium">Hours Breakdown by Year</h4>

            {years.map((year) => {
              const yearHours = yearGroups[year];
              const yearTotal = calculateHoursTotal(yearHours);

              return (
                <div key={year} className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg">
                    <h5 className="font-semibold text-lg">{year}</h5>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Year Total</p>
                      <p className="text-xl font-bold text-blue-600">{yearTotal.toFixed(1)} hours</p>
                    </div>
                  </div>

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
                        {yearHours
                          .sort(
                            (a, b) =>
                              new Date(b.concert?.scheduled_date || "").getTime() -
                              new Date(a.concert?.scheduled_date || "").getTime()
                          )
                          .map((sh) => (
                            <TableRow key={sh.id}>
                              <TableCell>
                                {sh.concert?.scheduled_date &&
                                  new Date(sh.concert.scheduled_date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{sh.concert?.series?.name || "N/A"}</TableCell>
                              <TableCell>{sh.concert?.venue?.name || "N/A"}</TableCell>
                              <TableCell>{sh.hours.toFixed(1)}</TableCell>
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
              );
            })}
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
