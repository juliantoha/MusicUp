import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import type { VenueType } from "@/types/db";

interface VenueTypeBadgeProps {
  venueType: VenueType | null | undefined;
  showIcon?: boolean;
  className?: string;
}

export function VenueTypeBadge({ venueType, showIcon = false, className }: VenueTypeBadgeProps) {
  if (!venueType) {
    return null;
  }

  return (
    <Badge variant="secondary" className={className}>
      {showIcon && <Tag className="w-3 h-3 mr-1" />}
      {venueType.label}
    </Badge>
  );
}
