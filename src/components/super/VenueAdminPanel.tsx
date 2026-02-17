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
import { Search, UserPlus, Trash2, Shield, Building2, MapPin, Mail, Camera, Upload, Loader2 } from "lucide-react";
import type { Venue, Profile } from "@/types/db";

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

  useEffect(() => {
    loadAdmins();
    loadVenueContacts();
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

      // Show the invitation token for testing (in production, this would be sent via email)
      if ("invitation" in result && result.invitation) {
        console.log("Invitation token (for testing):", result.invitation.token);
        toast.info("Check console for invitation token (for testing)");
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
