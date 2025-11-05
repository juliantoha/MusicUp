"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, Clock, TrendingUp } from "lucide-react";
import { getAdminMetrics } from "@/lib/metrics/actions";

interface Metrics {
  bookingsLast7Days: number;
  concertsCompleted: number;
  hoursGrantedLast7Days: number;
}

export function AdminMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);

    const result = await getAdminMetrics();

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setMetrics({
      bookingsLast7Days: result.bookingsLast7Days,
      concertsCompleted: result.concertsCompleted,
      hoursGrantedLast7Days: result.hoursGrantedLast7Days,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchMetrics();

    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading && !metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Activity Metrics
          </CardTitle>
          <CardDescription>Last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading metrics...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Activity Metrics
          </CardTitle>
          <CardDescription>Last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-destructive">Error loading metrics: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Activity Metrics
            </CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </div>
          {loading && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Refreshing...
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Bookings Created */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Bookings Created</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {metrics?.bookingsLast7Days || 0}
            </div>
            <div className="text-xs text-muted-foreground">New performer bookings</div>
          </div>

          {/* Concerts Completed */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Concerts Completed</span>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {metrics?.concertsCompleted || 0}
            </div>
            <div className="text-xs text-muted-foreground">Successfully finished</div>
          </div>

          {/* Hours Granted */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Hours Granted</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {metrics?.hoursGrantedLast7Days || 0}
            </div>
            <div className="text-xs text-muted-foreground">Service hours awarded</div>
          </div>
        </div>

        {/* Empty state */}
        {metrics &&
          metrics.bookingsLast7Days === 0 &&
          metrics.concertsCompleted === 0 &&
          metrics.hoursGrantedLast7Days === 0 && (
            <div className="mt-4 text-center py-4 border-t">
              <p className="text-sm text-muted-foreground">
                No activity in the last 7 days. Metrics will update automatically as events occur.
              </p>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
