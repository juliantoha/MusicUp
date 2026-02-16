"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, TrendingUp } from "lucide-react";
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
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !metrics) {
    return (
      <div className="grid sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-gray-100 shadow-sm">
            <CardContent className="pt-5 pb-4">
              <div className="h-9 w-9 rounded-xl skeleton mb-3" />
              <div className="h-8 w-16 skeleton mb-1" />
              <div className="h-3 w-24 skeleton" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="pt-5 pb-4 text-center text-sm text-red-500">
          Error loading metrics: {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <Card className="group border border-gray-100 shadow-sm card-hover bg-white">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-[#2563EB]" />
            </div>
            <span className="text-sm font-medium text-gray-500">Bookings</span>
            {loading && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse ml-auto" />}
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-0.5">
            {metrics?.bookingsLast7Days || 0}
          </div>
          <p className="text-xs text-gray-400">Created in last 7 days</p>
        </CardContent>
      </Card>

      <Card className="group border border-gray-100 shadow-sm card-hover bg-white">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-xl bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Completed</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-0.5">
            {metrics?.concertsCompleted || 0}
          </div>
          <p className="text-xs text-gray-400">Concerts finished</p>
        </CardContent>
      </Card>

      <Card className="group border border-gray-100 shadow-sm card-hover bg-white">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-[#8B5CF6]" />
            </div>
            <span className="text-sm font-medium text-gray-500">Hours Granted</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-0.5">
            {metrics?.hoursGrantedLast7Days || 0}
          </div>
          <p className="text-xs text-gray-400">Awarded in last 7 days</p>
        </CardContent>
      </Card>

      {/* Empty state hint */}
      {metrics &&
        metrics.bookingsLast7Days === 0 &&
        metrics.concertsCompleted === 0 &&
        metrics.hoursGrantedLast7Days === 0 && (
          <div className="col-span-full text-center py-2">
            <p className="text-xs text-gray-400">
              No activity in the last 7 days. Metrics update automatically.
            </p>
          </div>
        )}
    </div>
  );
}
