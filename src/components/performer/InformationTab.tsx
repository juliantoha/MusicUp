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
import { emptyStates } from "@/lib/copy";

// Helper function to group service hours by year
function groupServiceHoursByYear(serviceHours: ServiceHourWithDetails[]) {
  const yearGroups: { [year: string]: ServiceHourWithDetails[] } = {};

  serviceHours.forEach((sh) => {
    if (sh.concert?.starts_at) {
      const year = new Date(sh.concert.starts_at).getFullYear().toString();
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
    sh.concert?.starts_at
      ? new Date(sh.concert.starts_at).toLocaleDateString("en-US", { timeZone: "America/Los_Angeles" })
      : "N/A",
    sh.concert?.venue?.name || "N/A",
    sh.concert?.series?.title || "N/A",
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
          <div className="bg-white border border-green-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">All-Time Total</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{allTimeTotal.toFixed(1)}</p>
            <p className="text-xs text-gray-400">Verified hours</p>
          </div>
          <div className="bg-white border border-amber-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Pending</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{pendingHours.toFixed(1)}</p>
            <p className="text-xs text-gray-400">Awaiting verification</p>
          </div>
          <div className="bg-white border border-blue-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Music2 className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Concerts</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{pastConcerts.length}</p>
            <p className="text-xs text-gray-400">Total performances</p>
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
                  <div className="flex items-center justify-between bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl">
                    <h5 className="font-bold text-lg text-gray-900">{year}</h5>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Year Total</p>
                      <p className="text-xl font-bold text-gray-900">{yearTotal.toFixed(1)} <span className="text-sm font-medium text-gray-400">hours</span></p>
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
                              new Date(b.concert?.starts_at || "").getTime() -
                              new Date(a.concert?.starts_at || "").getTime()
                          )
                          .map((sh) => (
                            <TableRow key={sh.id}>
                              <TableCell>
                                {sh.concert?.starts_at &&
                                  new Date(sh.concert.starts_at).toLocaleDateString("en-US", { timeZone: "America/Los_Angeles" })}
                              </TableCell>
                              <TableCell>{sh.concert?.series?.title || "N/A"}</TableCell>
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
          <div className="text-center py-12 bg-muted/10 rounded-lg border-2 border-dashed">
            <Clock className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 text-muted-foreground" />
            <p className="text-base md:text-lg font-medium text-foreground mb-1">
              {emptyStates.noServiceHours.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {emptyStates.noServiceHours.message}
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
                    <h4 className="font-medium">{concert.series?.title}</h4>
                    <p className="text-sm text-gray-600">{concert.venue?.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(concert.starts_at).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        timeZone: "America/Los_Angeles",
                      })}
                    </p>
                  </div>
                  <Badge>Completed</Badge>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/10 rounded-lg border-2 border-dashed">
            <Music2 className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 text-muted-foreground" />
            <p className="text-base md:text-lg font-medium text-foreground mb-1">
              No past concerts yet
            </p>
            <p className="text-sm text-muted-foreground">
              Completed performances will appear here
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
