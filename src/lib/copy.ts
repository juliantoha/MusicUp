/**
 * MusicUp Copy Module
 *
 * Centralized UI strings for consistent, friendly, and concise messaging.
 * Keep text human and approachable throughout the application.
 */

// ============================================================================
// Booking Flow - Steps and Microcopy
// ============================================================================

export const booking = {
  steps: {
    labels: ["Where are you playing?", "Select Concert", "Pick your set and level"],
    descriptions: [
      "Find a venue near you",
      "Choose a concert series that fits this venue",
      "Select the piece and difficulty level",
    ],
  },

  validation: {
    selectVenue: "Please select a venue",
    selectConcert: "Please select a concert",
    completeSelections: "Please complete all selections",
  },

  success: {
    created: "Concert booked successfully! 🎵",
    updated: "Booking updated successfully",
    cancelled: "Booking cancelled",
  },

  errors: {
    cannotModify: "Cannot modify booking within 24 hours of concert start time",
    cannotCancel: "Cannot cancel booking within 24 hours of concert start time",
    failed: "Failed to create booking",
  },

  actions: {
    bookNow: "Book This Concert",
    booking: "Booking...",
    editBooking: "Edit Booking",
    cancelBooking: "Cancel Booking",
    confirmCancel: "Yes, Cancel Booking",
    keepBooking: "Keep Booking",
  },

  dialogs: {
    cancelTitle: "Cancel Booking?",
    cancelMessage: "Are you sure you want to cancel this booking? This action cannot be undone.",
    editTitle: "Edit Booking",
  },
};

// ============================================================================
// Empty States
// ============================================================================

export const emptyStates = {
  noBookings: {
    title: "No upcoming bookings",
    message: "Book your first concert to get started with performing!",
  },

  noConcerts: {
    title: "No upcoming concerts",
    message: "No upcoming concerts scheduled at this venue.",
    hint: "Please select a different venue or check back later.",
  },

  noServiceHours: {
    title: "No service hours yet",
    message: "Complete your first performance to start earning hours!",
  },

  noVenues: {
    title: "No venues available",
    message: "Check back soon for performance opportunities!",
  },

  noPieces: {
    title: "Choose a series to get started",
    message: "Select a music series above to browse available pieces",
  },

  noPhotos: {
    title: "No photos yet",
    message: "Upload photos to share memories from this concert",
  },

  noAdminVenues: {
    title: "No venues assigned",
    message: "Contact a super admin to get venue access",
  },

  noPerformances: {
    title: "No performances yet",
    message: "Your concert history will appear here",
  },
};

// ============================================================================
// Admin Checklist - Concert Management
// ============================================================================

export const admin = {
  checklist: {
    markPerformed: "Performed",
    markAbsent: "Absent",
    markConfirmed: "Confirmed",
    uploadPhoto: "Upload photos of the concert (max 5MB, JPG/PNG)",
    completeConcert: "Complete Concert",
    completing: "Completing...",
  },

  status: {
    allRequirementsMet: "All requirements met! Ready to complete concert.",
    needsAttendance: "Mark attendance for all performers",
    needsPhotos: "Upload at least one group photo",
    completed: "Concert completed",
    upcoming: "Upcoming",
    past: "Past",
  },

  actions: {
    viewDetails: "View Details",
    createConcert: "Create Concert",
    editConcert: "Edit Concert",
    deleteConcert: "Delete Concert",
    uploadPhotos: "Upload Photos",
  },

  messages: {
    concertCompleted: "Concert marked as complete! Thank you emails sent to performers.",
    statusUpdated: "Status updated successfully",
    photoUploaded: "Photo uploaded successfully",
    photoDeleted: "Photo deleted successfully",
  },
};

// ============================================================================
// Email Subject Lines and Preheaders
// ============================================================================

export const email = {
  bookingConfirmation: {
    subject: (pieceName: string) => `🎵 Concert Booking Confirmed - ${pieceName}`,
    preheader: "Your performance has been confirmed! Here are the details.",
  },

  concertReminder: {
    subject: (concertTime: string) => `⏰ Concert Reminder - Tomorrow at ${concertTime}`,
    preheader: "Your concert is coming up soon. Time to practice!",
  },

  completionThankYou: {
    subject: "🎉 Thank You for Performing - 3 Hours Credited!",
    preheader: "Great job on your performance! Your service hours have been added.",
  },

  greetings: {
    casual: (name: string) => `Hi ${name},`,
    formal: (name: string) => `Dear ${name},`,
  },

  closings: {
    casual: "See you at the concert!",
    thankYou: "Thank you for being part of our music community!",
    reminder: "Looking forward to your performance!",
  },
};

// ============================================================================
// Common UI Text
// ============================================================================

export const common = {
  loading: "Loading...",
  saving: "Saving...",
  deleting: "Deleting...",
  uploading: "Uploading...",

  actions: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    download: "Download",
    upload: "Upload",
    back: "Back",
    next: "Next",
    submit: "Submit",
    close: "Close",
    confirm: "Confirm",
  },

  validation: {
    required: "This field is required",
    invalidEmail: "Please enter a valid email address",
    invalidDate: "Please enter a valid date",
  },

  errors: {
    generic: "An unexpected error occurred",
    notFound: "Not found",
    unauthorized: "You don't have permission to do that",
    networkError: "Network error. Please check your connection.",
  },
};

// ============================================================================
// Performance Details - Stage Labels
// ============================================================================

export const performance = {
  stages: {
    stage_1: "Stage 1 - Beginner",
    stage_2: "Stage 2 - Intermediate",
    stage_3: "Stage 3 - Advanced",
  },

  difficulty: {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  },

  status: {
    confirmed: "Confirmed",
    performed: "Performed",
    absent: "Absent",
    cancelled: "Cancelled",
  },
};

// ============================================================================
// Service Hours
// ============================================================================

export const serviceHours = {
  labels: {
    total: "Total Hours",
    year: (year: string) => `${year} Service Hours`,
    allTime: "All-Time Total",
  },

  export: {
    button: "Export CSV",
    filename: (date: string) => `service-hours-${date}.csv`,
  },

  messages: {
    hoursGranted: (hours: number) => `${hours} hours credited to your account`,
    noHours: "No service hours recorded yet",
  },
};

// ============================================================================
// Navigation and Tabs
// ============================================================================

export const navigation = {
  performer: {
    bookConcert: "Book Concert",
    myBookings: "My Bookings",
    information: "Information",
    library: "Library",
  },

  admin: {
    concerts: "Concerts",
    myPerformances: "My Performances",
  },

  super: {
    venues: "Venue Management",
    tools: "Role Tools",
  },
};

// ============================================================================
// Role Management
// ============================================================================

export const roles = {
  labels: {
    performer: "Performer",
    admin: "Admin",
    superAdmin: "Super Admin",
  },

  descriptions: {
    performer: "Can book concerts and view their service hours",
    admin: "Can manage concerts and bookings for assigned venues",
    superAdmin: "Full system access, can manage all venues and users",
  },

  actions: {
    promoteToSuperAdmin: "Promote to Super Admin",
    grantVenueAdmin: "Grant Venue Admin Access",
    promoting: "Promoting...",
    granting: "Granting Access...",
  },

  messages: {
    promoted: (email: string, previousRole: string) =>
      `${email} has been promoted to super admin (was ${previousRole})`,
    venueAccessGranted: (email: string, venueName: string) =>
      `${email} has been granted admin access to ${venueName}`,
    alreadySuperAdmin: "User is already a super admin",
    alreadyHasAccess: "User already has admin access to this venue",
  },

  warnings: {
    irreversible: "These tools modify user permissions and should be used with caution. All actions are logged and irreversible.",
  },
};

// ============================================================================
// Venue and Concert Info
// ============================================================================

export const venue = {
  labels: {
    name: "Venue Name",
    address: "Address",
    city: "City",
    state: "State",
    zip: "ZIP Code",
    contact: "Contact Information",
  },

  actions: {
    createVenue: "Create Venue",
    editVenue: "Edit Venue",
    deleteVenue: "Delete Venue",
  },
};

export const concert = {
  labels: {
    date: "Date",
    time: "Time",
    venue: "Venue",
    series: "Series",
    performers: "Performers",
    status: "Status",
  },

  info: {
    performerCount: (count: number) => `${count} ${count === 1 ? "performer" : "performers"}`,
    spotsAvailable: (count: number) => `${count} ${count === 1 ? "spot" : "spots"} available`,
    fullyConcert: "Fully booked",
  },
};
