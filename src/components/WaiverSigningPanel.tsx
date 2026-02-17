"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { FileText, Download, Upload, Loader2, Check } from "lucide-react";
import { uploadSignedWaiver } from "@/lib/waivers/actions";
import type { VenueWaiver } from "@/types/db";

interface WaiverSigningPanelProps {
  waivers: VenueWaiver[];
  venueName: string;
  onAllSigned: () => void;
}

export function WaiverSigningPanel({ waivers, venueName, onAllSigned }: WaiverSigningPanelProps) {
  const [signedWaiverIds, setSignedWaiverIds] = useState<Set<string>>(new Set());
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleUploadSigned = async (waiverId: string, file: File) => {
    setUploadingId(waiverId);

    const fd = new FormData();
    fd.append("waiver_id", waiverId);
    fd.append("file", file);

    const result = await uploadSignedWaiver(fd);

    if ("error" in result && result.error) {
      toast.error(result.error);
    } else if ("success" in result) {
      toast.success("Signed waiver uploaded");
      const newSigned = new Set(signedWaiverIds);
      newSigned.add(waiverId);
      setSignedWaiverIds(newSigned);

      // Check if all waivers are now signed
      if (newSigned.size === waivers.length) {
        onAllSigned();
      }
    }

    setUploadingId(null);
    const ref = fileInputRefs.current[waiverId];
    if (ref) ref.value = "";
  };

  const allSigned = signedWaiverIds.size === waivers.length;

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Waiver Required for {venueName}
            </p>
            <p className="text-xs text-amber-700 mt-1">
              This venue requires you to sign {waivers.length === 1 ? "a waiver" : `${waivers.length} waivers`} before proceeding.
              Download the PDF, sign it, and upload the signed version.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {waivers.map((waiver) => {
          const isSigned = signedWaiverIds.has(waiver.id);
          const isUploading = uploadingId === waiver.id;

          return (
            <Card
              key={waiver.id}
              className={`p-4 border transition-colors ${
                isSigned ? "border-green-200 bg-green-50/50" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isSigned ? "bg-green-100" : "bg-amber-50"
                  }`}>
                    {isSigned ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${isSigned ? "text-green-800" : "text-gray-900"}`}>
                      {waiver.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isSigned ? "Signed" : "Signature required"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(waiver.waiver_url, "_blank")}
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Download
                  </Button>
                  {!isSigned && (
                    <>
                      <input
                        ref={(el) => { fileInputRefs.current[waiver.id] = el; }}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadSigned(waiver.id, file);
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => fileInputRefs.current[waiver.id]?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5 mr-1" />
                        )}
                        {isUploading ? "Uploading..." : "Upload Signed"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {allSigned && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <Check className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="text-sm font-medium text-green-800">All waivers signed! You may now proceed.</p>
        </div>
      )}
    </div>
  );
}
