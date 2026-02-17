"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Loader2, Building2 } from "lucide-react";
import { getMySignedWaivers } from "@/lib/waivers/actions";

export function SignedWaiversView() {
  const [signedWaivers, setSignedWaivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSignedWaivers();
  }, []);

  const loadSignedWaivers = async () => {
    setLoading(true);
    const result = await getMySignedWaivers();
    if ("signedWaivers" in result) {
      setSignedWaivers(result.signedWaivers ?? []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 py-4">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading signed waivers...
      </div>
    );
  }

  if (signedWaivers.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
        <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm text-gray-500">No signed waivers yet</p>
        <p className="text-xs text-gray-400 mt-1">Signed waivers will appear here after you complete them.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-amber-600" />
        <h4 className="text-sm font-semibold text-gray-700">My Signed Waivers</h4>
      </div>
      <div className="space-y-2">
        {signedWaivers.map((sw: any) => (
          <Card key={sw.id} className="p-3 border border-gray-100">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {sw.waiver?.title || "Waiver"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {sw.waiver?.venue && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {sw.waiver.venue.name}
                      </span>
                    )}
                    <span>Signed {new Date(sw.signed_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(sw.signed_pdf_url, "_blank")}
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                View
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
