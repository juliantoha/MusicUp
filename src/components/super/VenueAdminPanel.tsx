"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  getVenueAdmins,
  searchProfiles,
  addVenueAdmin,
  removeVenueAdmin,
  updateProfileRole,
} from "@/lib/admin/actions";
import {
  inviteVenueContact,
  getVenueContacts,
  removeVenueContact,
} from "@/lib/super/actions";
import { uploadVenuePhoto } from "@/lib/venues/actions";
import { uploadVenueWaiver, deactivateWaiver, getVenueWaivers, getWaiverSignatures } from "@/lib/waivers/actions";
import { Search, UserPlus, Trash2, Shield, Building2, MapPin, Mail, Camera, Upload, Loader2, FileText, Eye, X, Users } from "lucide-react";
import type { Venue, Profile, VenueWaiver } from "@/types/db";

interface VenueAdminPanelProps {
  venue: Venue;
}

export function VenueAdminPanel({ venue }: VenueAdminPanelProps) {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  // Venue Contact state
  const [venueContacts, setVenueContacts] = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [contactInviteEmail, setContactInviteEmail] = useState("");
  const [invitingContact, setInvitingContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [showRemoveContactDialog, setShowRemoveContactDialog] = useState(false);

  // Venue Photos state
  const [uploadingExterior, setUploadingExterior] = useState(false);
  const [uploadingInterior, setUploadingInterior] = useState(false);
  const [exteriorPhotoUrl, setExteriorPhotoUrl] = useState(venue.exterior_photo_url || "");
  const [interiorPhotoUrl, setInteriorPhotoUrl] = useState(venue.interior_photo_url || "");
  const exteriorInputRef = useRef<HTMLInputElement>(null);
  const interiorInputRef = useRef<HTMLInputElement>(null);

  // Waiver state
  const [waivers, setWaivers] = useState<VenueWaiver[]>([]);
  const [loadingWaivers, setLoadingWaivers] = useState(true);
  const [uploadingWaiver, setUploadingWaiver] = useState(false);
  const [waiverTitle, setWaiverTitle] = useState("");
  const [waiverSignatures, setWaiverSignatures] = useState<Record<string, any[]>>({});
  const [expandedWaiver, setExpandedWaiver] = useState<string | null>(null);
  const waiverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAdmins();
    loadVenueContacts();
    loadWaivers();
    setExteriorPhotoUrl(venue.exterior_photo_url || "");
    setInteriorPhotoUrl(venue.interior_photo_url || "");
  }, [venue.id, venue.exterior_photo_url, venue.interior_photo_url]);

  const loadAdmins = async () => {
    setLoadingAdmins(true);
    const result = await getVenueAdmins(venue.id);
    if ("admins" in result && result.admins) {
      setAdmins(result.admins);
    } else if ("error" in result && result.error) {
      toast.error(result.error);
    }
    setLoadingAdmins(false);
  };

  const loadWaivers = async () => {
    setLoadingWaivers(true);
    const result = await getVenueWaivers(venue.id);
    if ("waivers" in result && result.waivers) {
      setWaivers(result.waivers);
    }
    setLoadingWaivers(false);
  };

  const loadSignatures = async (waiverId: string) => {
    const result = await getWaiverSignatures(waiverId);
    if ("signatures" in result && result.signatures) {
      setWaiverSignatures((prev) => ({ ...prev, [waiverId]: result.signatures }));
    }
  };

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      toast.error("Please enter an email to search");
      return;
    }

    setSearching(true);
    const result = await searchProfiles(searchEmail);

    if ("profiles" in result && result.profiles) {
      setSearchResults(result.profiles);
      if (result.profiles.length === 0) {
        toast.info("No users found with that email");
      }
    } else if ("error" in result && result.error) {
      toast.error(result.error);
    }

    setSearching(false);
  };

  const handleAddAdmin = async (profileId: string) => {
    const result = await addVenueAdmin(venue.id, profileId);

    if ("success" in result && result.success) {
      toast.success("Admin added to venue successfully");
      loadAdmins();
      setSearchResults([]);
      setSearchEmail("");
    } else if ("error" in result && result.error) {
      toast.error(result.error);
    }
  };

  const handleRemoveAdmin = async () => {
    if (!selectedAdmin) return;

    const result = await removeVenueAdmin(selectedAdmin);

    if ("success" in result && result.success) {
      toast.success("Admin removed from venue");
      loadAdmins();
    } else if ("error" in result && result.error) {
      toast.error(result.error);
    }

    setShowRemoveDialog(false);
    setSelectedAdmin(null);
  };

  const handleRoleChange = async (profileId: string, newRole: "performer" | "admin" | "super_admin") => {
    const result = await updateProfileRole(profileId, newRole);

    if ("success" in result && result.success) {
      toast.success(`User role updated to ${newRole}`);
      loadAdmins();
    } else if ("error" in result && result.error) {
      toast.error(result.error);
    }
  };

  const confirmRemove = (mappingId: string) => {
    setSelectedAdmin(mappingId);
    setShowRemoveDialog(true);
  };

  // Venue Contact functions
  const loadVenueContacts = async () => {
    setLoadingContacts(true);
    const result = await getVenueContacts(venue.id);
    if ("contacts" in result && result.contacts) {
      setVenueContacts(result.contacts);
    } else if ("error" in result && result.error) {
      toast.error(result.error);
    }
    setLoadingContacts(false);
  };

  const handleInviteContact = async () => {
    if (!contactInviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setInvitingContact(true);
    const result = await inviteVenueContact(contactInviteEmail, venue.id);

    if ("success" in result && result.success) {
      toast.success(`Invitation sent to ${contactInviteEmail}`);
      setContactInviteEmail("");
      loadVenueContacts();

      // Invitation token is sent via email — no need to expose in client
      if ("invitation" in result && result.invitation) {
        toast.info("Invitation email sent with setup instructions");
      }
    } else if ("error" in result && result.error) {
      toast.error(result.error);
    }

    setInvitingContact(false);
  };

  const handleRemoveContact = async () => {
    if (!selectedContact) return;

    const result = await removeVenueContact(selectedContact);

    if ("success" in result && result.success) {
      toast.success("Venue contact removed");
      loadVenueContacts();
    } else if ("error" in result && result.error) {
      toast.error(result.error);
    }

    setShowRemoveContactDialog(false);
    setSelectedContact(null);
  };

  const confirmRemoveContact = (contactId: string) => {
    setSelectedContact(contactId);
    setShowRemoveContactDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Venue Header */}
      <Card className="p-6 border border-gray-100">
        <div className="flex items-start gap-3">
          <Building2 className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h2 className="text-2xl font-bold mb-2">{venue.name}</h2>
            <div className="space-y-1 text-gray-600">
              <p>
                {venue.address}, {venue.city}, {venue.state} {venue.zip}
              </p>
              {venue.venue_contact_name && (
                <p>
                  <strong>Contact:</strong> {venue.venue_contact_name}
                  {venue.venue_contact_email && ` (${venue.venue_contact_email})`}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Venue Photos */}
      <Card className="p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Camera className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Venue Photos</h3>
            <p className="text-sm text-gray-500">Upload or replace exterior and interior photos for this venue.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Exterior Photo */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Exterior Photo</p>
            <input
              ref={exteriorInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploadingExterior(true);
                const fd = new FormData();
                fd.append("venue_id", venue.id);
                fd.append("photo_type", "exterior");
                fd.append("file", file);
                const result = await uploadVenuePhoto(fd);
                if ("error" in result && result.error) {
                  toast.error(result.error);
                } else if ("url" in result && result.url) {
                  setExteriorPhotoUrl(result.url);
                  toast.success("Exterior photo uploaded");
                }
                setUploadingExterior(false);
                if (exteriorInputRef.current) exteriorInputRef.current.value = "";
              }}
            />
            {exteriorPhotoUrl ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-[4/3]">
                <Image
                  src={exteriorPhotoUrl}
                  alt="Venue exterior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => exteriorInputRef.current?.click()}
                    disabled={uploadingExterior}
                  >
                    {uploadingExterior ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Upload className="w-4 h-4 mr-1" />}
                    Replace
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => exteriorInputRef.current?.click()}
                disabled={uploadingExterior}
                className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors flex flex-col items-center justify-center gap-2"
              >
                {uploadingExterior ? (
                  <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-300" />
                    <span className="text-xs text-gray-500">Upload exterior photo</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Interior Photo */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Interior Photo</p>
            <input
              ref={interiorInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploadingInterior(true);
                const fd = new FormData();
                fd.append("venue_id", venue.id);
                fd.append("photo_type", "interior");
                fd.append("file", file);
                const result = await uploadVenuePhoto(fd);
                if ("error" in result && result.error) {
                  toast.error(result.error);
                } else if ("url" in result && result.url) {
                  setInteriorPhotoUrl(result.url);
                  toast.success("Interior photo uploaded");
                }
                setUploadingInterior(false);
                if (interiorInputRef.current) interiorInputRef.current.value = "";
              }}
            />
            {interiorPhotoUrl ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-[4/3]">
                <Image
                  src={interiorPhotoUrl}
                  alt="Venue interior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => interiorInputRef.current?.click()}
                    disabled={uploadingInterior}
                  >
                    {uploadingInterior ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Upload className="w-4 h-4 mr-1" />}
                    Replace
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => interiorInputRef.current?.click()}
                disabled={uploadingInterior}
                className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors flex flex-col items-center justify-center gap-2"
              >
                {uploadingInterior ? (
                  <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-300" />
                    <span className="text-xs text-gray-500">Upload interior photo</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Venue Waivers */}
      <Card className="p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Venue Waivers</h3>
            <p className="text-sm text-gray-500">Upload PDF waivers that performers and hosts must sign before participating.</p>
          </div>
        </div>

        {/* Existing Waivers */}
        {loadingWaivers ? (
          <div className="space-y-3 mb-4">
            <div className="h-14 skeleton rounded-lg" />
          </div>
        ) : waivers.length > 0 ? (
          <div className="space-y-3 mb-6">
            {waivers.map((waiver) => (
              <div key={waiver.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{waiver.title}</p>
                      <p className="text-xs text-gray-500">
                        Added {new Date(waiver.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(waiver.waiver_url, "_blank")}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (expandedWaiver === waiver.id) {
                          setExpandedWaiver(null);
                        } else {
                          setExpandedWaiver(waiver.id);
                          if (!waiverSignatures[waiver.id]) {
                            loadSignatures(waiver.id);
                          }
                        }
                      }}
                    >
                      <Users className="w-3.5 h-3.5 mr-1" />
                      Signatures
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        const result = await deactivateWaiver(waiver.id);
                        if ("success" in result) {
                          toast.success("Waiver deactivated");
                          loadWaivers();
                        } else if ("error" in result) {
                          toast.error(result.error);
                        }
                      }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Signatures Expandable */}
                {expandedWaiver === waiver.id && (
                  <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Signed By</p>
                    {!waiverSignatures[waiver.id] ? (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </div>
                    ) : waiverSignatures[waiver.id].length === 0 ? (
                      <p className="text-sm text-gray-500">No signatures yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {waiverSignatures[waiver.id].map((sig: any) => (
                          <div key={sig.id} className="flex items-center justify-between gap-3 bg-white rounded-lg p-3 border border-gray-100">
                            <div>
                              <p className="text-sm font-medium">{sig.profile?.full_name || "Unknown"}</p>
                              <p className="text-xs text-gray-500">{sig.profile?.email} - {sig.profile?.role}</p>
                              <p className="text-xs text-gray-400">Signed {new Date(sig.signed_at).toLocaleDateString()}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(sig.signed_pdf_url, "_blank")}
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              PDF
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 mb-4 bg-gray-50 rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p>No waivers for this venue.</p>
            <p className="text-sm mt-1">Upload a PDF waiver below.</p>
          </div>
        )}

        {/* Upload New Waiver */}
        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Upload className="w-4 h-4 text-amber-600" />
            </div>
            Upload New Waiver
          </h4>
          <div className="flex gap-2">
            <Input
              className="h-10 border-gray-200 bg-white flex-1"
              placeholder="Waiver title (e.g., Photo Release Form)..."
              value={waiverTitle}
              onChange={(e) => setWaiverTitle(e.target.value)}
            />
            <input
              ref={waiverInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (!waiverTitle.trim()) {
                  toast.error("Please enter a waiver title first");
                  if (waiverInputRef.current) waiverInputRef.current.value = "";
                  return;
                }
                setUploadingWaiver(true);
                const fd = new FormData();
                fd.append("venue_id", venue.id);
                fd.append("title", waiverTitle.trim());
                fd.append("file", file);
                const result = await uploadVenueWaiver(fd);
                if ("error" in result && result.error) {
                  toast.error(result.error);
                } else if ("success" in result) {
                  toast.success("Waiver uploaded successfully");
                  setWaiverTitle("");
                  loadWaivers();
                }
                setUploadingWaiver(false);
                if (waiverInputRef.current) waiverInputRef.current.value = "";
              }}
            />
            <Button
              onClick={() => {
                if (!waiverTitle.trim()) {
                  toast.error("Please enter a waiver title first");
                  return;
                }
                waiverInputRef.current?.click();
              }}
              disabled={uploadingWaiver}
            >
              {uploadingWaiver ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              {uploadingWaiver ? "Uploading..." : "Upload PDF"}
            </Button>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-sm text-amber-800">
            <p className="font-medium mb-1">About Venue Waivers:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Performers must sign all active waivers before they can book at this venue</li>
              <li>Hosts assigned to this venue must also sign all active waivers</li>
              <li>Signed waivers are visible to the signer, venue hosts, and super admins</li>
              <li>Deactivating a waiver removes the signing requirement but keeps existing signatures</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Current Admins */}
      <Card className="p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold">Current Administrators</h3>
        </div>

        {loadingAdmins ? (
          <div className="space-y-3">
            <div className="h-16 skeleton rounded-lg" />
            <div className="h-16 skeleton rounded-lg" />
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-8 h-8 text-gray-400" />
            </div>
            <p>No administrators assigned to this venue yet.</p>
            <p className="text-sm mt-1">Use the search below to add admins.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {admins.map((item: any) => {
              const admin = item.admin;
              return (
                <Card key={item.id} className="p-4 card-hover border border-gray-100">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{admin?.full_name || "Unknown"}</p>
                        <Badge
                          variant={
                            admin?.role === "super_admin"
                              ? "default"
                              : admin?.role === "admin"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {admin?.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{admin?.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={admin?.role}
                        onValueChange={(value: any) => handleRoleChange(admin?.id, value)}
                      >
                        <SelectTrigger className="w-40 h-10 border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="performer">Performer</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmRemove(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      {/* Add Admin */}
      <Card className="p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold">Add Administrator</h3>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                className="h-10 border-gray-200 bg-white"
                placeholder="Search by email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={searching}>
              <Search className="w-4 h-4 mr-2" />
              {searching ? "Searching..." : "Search"}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Search Results:</p>
              {searchResults.map((profile) => (
                <Card key={profile.id} className="p-4 card-hover border border-gray-100">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{profile.full_name || "Unknown"}</p>
                        <Badge
                          variant={
                            profile.role === "super_admin"
                              ? "default"
                              : profile.role === "admin"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {profile.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{profile.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {profile.role === "performer" && (
                        <p className="text-sm text-orange-600 mr-2">
                          Must be promoted to admin first
                        </p>
                      )}
                      <Button
                        onClick={() => handleAddAdmin(profile.id)}
                        disabled={profile.role === "performer"}
                        size="sm"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add to Venue
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-sm text-blue-800">
            <p className="font-medium mb-1">Note:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Only users with "admin" or "super_admin" role can be added as venue administrators</li>
              <li>Use the role dropdown above to promote performers to admin before adding them</li>
              <li>Promoting a user to admin will enable the /admin page for them</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Venue Contacts Section */}
      <Card className="p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold">Venue Contacts</h3>
        </div>

        {loadingContacts ? (
          <div className="space-y-3 mb-4">
            <div className="h-16 skeleton rounded-lg" />
            <div className="h-16 skeleton rounded-lg" />
          </div>
        ) : venueContacts.length === 0 ? (
          <div className="text-center py-6 text-gray-500 mb-4 bg-gray-50 rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <p>No venue contacts assigned yet.</p>
            <p className="text-sm mt-1">Invite someone using the form below.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {venueContacts.map((contact: any) => {
              const profile = contact.profile;
              return (
                <Card key={contact.id} className="p-4 card-hover border border-gray-100">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{profile?.full_name || "Unknown"}</p>
                        <Badge
                          variant={contact.status === "active" ? "default" : "secondary"}
                        >
                          {contact.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{profile?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Invited: {new Date(contact.invited_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmRemoveContact(contact.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-orange-600" />
            </div>
            Invite Venue Contact
          </h4>
          <div className="flex gap-2">
            <Input
              className="h-10 border-gray-200 bg-white"
              placeholder="Enter email address..."
              value={contactInviteEmail}
              onChange={(e) => setContactInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInviteContact()}
            />
            <Button onClick={handleInviteContact} disabled={invitingContact}>
              <Mail className="w-4 h-4 mr-2" />
              {invitingContact ? "Sending..." : "Send Invite"}
            </Button>
          </div>

          <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 text-sm text-orange-800">
            <p className="font-medium mb-1">About Venue Contacts:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Venue contacts can view all concerts at their assigned venue</li>
              <li>They can see performer details, bookings, and concert photos</li>
              <li>They have read-only access and cannot schedule or cancel concerts</li>
              <li>If the email doesn't exist in the system, they'll need to sign up first</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Remove Admin Confirmation Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Administrator</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this administrator from the venue? They will lose
              access to manage concerts at this location.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveAdmin}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Venue Contact Confirmation Dialog */}
      <AlertDialog open={showRemoveContactDialog} onOpenChange={setShowRemoveContactDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Venue Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this venue contact? They will lose access to view
              concerts and information for this venue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveContact}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
