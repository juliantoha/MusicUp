# MusicUp Security Analysis

This document provides a comprehensive security analysis of the MusicUp application, covering Row Level Security (RLS) policies, storage bucket access controls, edge cases, and verification test checklists.

## Table of Contents

1. [Overview](#overview)
2. [Row Level Security (RLS) Coverage](#row-level-security-rls-coverage)
3. [Storage Bucket Access Modes](#storage-bucket-access-modes)
4. [Edge Cases Analysis](#edge-cases-analysis)
5. [Security Test Checklists](#security-test-checklists)
6. [Recommendations](#recommendations)

---

## Overview

MusicUp implements a three-tier role-based access control system:

- **Performer**: Can book concerts, view their own bookings and service hours
- **Admin**: Can manage concerts and bookings for assigned venues only
- **Super Admin**: Full system access, can manage all venues and users

Security is enforced at multiple layers:
1. **Database Layer**: Postgres Row Level Security (RLS) policies
2. **Application Layer**: Server-side authorization checks in server actions
3. **Storage Layer**: Supabase Storage policies for file access

---

## Row Level Security (RLS) Coverage

### RLS Policy Matrix

| Table | Performer | Admin | Super Admin | Notes |
|-------|-----------|-------|-------------|-------|
| **profiles** | Own profile (R/W) | Performers only (R) | All profiles (R/W) | Admins can view performers for concert management |
| **venues** | Active only (R) | All venues (R/W) | All venues (R/W) | Public read for active venues |
| **admins_venues** | ❌ None | Own assignments (R) | All assignments (R/W) | Junction table for venue access |
| **series** | All (R) | All (R/W) | All (R/W) | Public read for music catalog |
| **collections** | All (R) | All (R/W) | All (R/W) | Public read for music catalog |
| **pieces** | All (R) | All (R/W) | All (R/W) | Public read for music catalog |
| **piece_stages** | All (R) | All (R/W) | All (R/W) | Public read for difficulty levels |
| **concerts** | Scheduled (R) | All concerts (R/W) | All concerts (R/W) | Authenticated users see all for booking |
| **bookings** | Own bookings (R/W*) | Venue bookings (R/W) | All bookings (R/W) | *Write limited to before concert |
| **attendance_checks** | Own attendance (R) | Venue attendance (R/W) | All attendance (R/W) | Admin can mark attendance |
| **concert_photos** | All photos (R) | Venue photos (W) | All photos (W) | Public read, admin write |
| **service_hours** | Own hours (R) | Venue hours (R/W) | All hours (R/W) | Admin grants hours |

**Legend:**
- R = Read access
- W = Write access (insert/update/delete)
- R/W* = Conditional write access
- ❌ = No access

### Detailed Policy Breakdown

#### Profiles Table

**Policies:**
1. ✅ Users can view their own profile
2. ✅ Super admins can view all profiles
3. ✅ Admins can view performers (for concert management)
4. ✅ Users can update their own profile
5. ✅ Super admins can insert/update any profile

**Security Characteristics:**
- Role changes require super_admin privileges (enforced at application layer)
- Performers cannot see other performers' profiles
- Admins can only see performers, not other admins

#### Venues Table

**Policies:**
1. ✅ Anyone (including anonymous) can view active venues
2. ✅ Admins and super admins can view all venues (including inactive)
3. ✅ Admins and super admins can insert/update venues

**Security Characteristics:**
- Public access to active venues enables browsing without login
- Venue deactivation (is_active = false) hides from public

#### Admins-Venues Table (Junction)

**Policies:**
1. ✅ Admins can view their own venue assignments
2. ✅ Super admins can view all venue assignments
3. ✅ Only super admins can insert/delete assignments

**Security Characteristics:**
- Venue-scoped admin access model
- Admin cannot grant themselves access to new venues
- All venue access grants are audit-trailable

#### Music Catalog Tables (series, collections, pieces, piece_stages)

**Policies:**
1. ✅ Public read access (anyone can view)
2. ✅ Admins and super admins can insert/update

**Security Characteristics:**
- Open catalog browsing for all users
- Content management restricted to admin roles
- No delete policies (data preservation)

#### Concerts Table

**Policies:**
1. ✅ Anyone can view scheduled concerts
2. ✅ Authenticated users can view all concerts (for booking past concerts)
3. ✅ Admins and super admins can insert/update concerts

**Security Characteristics:**
- Public visibility of scheduled concerts
- Authenticated access required to see completed/cancelled concerts
- Concert status updates controlled by admin roles

#### Bookings Table

**Policies:**
1. ✅ Users can view their own bookings
2. ✅ Admins can view bookings for their assigned venues
3. ✅ Super admins can view all bookings
4. ✅ Performers can create their own bookings
5. ✅ **Users can only update their own bookings BEFORE concert starts**
6. ✅ Admins can update bookings for their venues
7. ✅ Super admins can update all bookings

**Security Characteristics:**
- **Critical**: Time-based write restriction prevents last-minute changes
- Performer isolation: cannot see other performers' bookings
- Venue-scoped admin access
- Application layer enforces 24-hour cutoff (more restrictive than RLS)

#### Attendance Checks Table

**Policies:**
1. ✅ Users can view their own attendance records
2. ✅ Admins can view/insert attendance for their venues
3. ✅ Super admins can view/insert all attendance

**Security Characteristics:**
- Admin creates attendance records post-concert
- Performers can verify their attendance was recorded
- Immutable once created (no update/delete policies)

#### Concert Photos Table

**Policies:**
1. ✅ Public read access (anyone can view photos)
2. ✅ Admins can upload photos for their venues
3. ✅ Super admins can upload photos anywhere

**Security Characteristics:**
- Public photo gallery encourages community engagement
- Upload restricted to admin roles
- Venue-scoped upload control for admins

#### Service Hours Table

**Policies:**
1. ✅ Users can view their own service hours
2. ✅ Admins can view/grant hours for their venues
3. ✅ Super admins can view/grant all hours

**Security Characteristics:**
- Unique constraint prevents double-granting (profile_id, concert_id)
- granted_by field creates audit trail
- No delete policy preserves historical records

---

## Storage Bucket Access Modes

### Bucket Configuration

| Bucket | Public Access | Upload | Update | Delete | Notes |
|--------|---------------|--------|--------|--------|-------|
| **scores** | ✅ Yes | Admin+ | Admin+ | Admin+ | Sheet music PDFs |
| **audio** | ✅ Yes | Admin+ | Admin+ | Admin+ | Reference recordings |
| **concert_photos** | ✅ Yes | Admin+ | Admin+ | Admin+ | Concert photo gallery |

**All buckets:**
- Public read access (no authentication required)
- Write operations require admin or super_admin role
- Enforced via Supabase Storage policies

### Storage Policy Details

#### Scores Bucket

```sql
-- Public read access
CREATE POLICY "Public read access to scores"
ON storage.objects FOR SELECT
USING (bucket_id = 'scores');

-- Admin/super_admin write access
CREATE POLICY "Admins and super_admins can upload scores"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'scores' AND
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'super_admin'))
);
```

**Security Characteristics:**
- Sheet music freely accessible for practice
- Upload controlled to prevent unauthorized content
- No granular venue-scoped access (all admins can upload)

**Potential Issue:**
- Admin from Venue A can upload scores that appear for all venues
- **Mitigation**: Application-layer file naming conventions and organization

#### Audio Bucket

Same policy structure as scores bucket.

**Security Characteristics:**
- Reference audio for all performers
- Prevents performers from uploading potentially copyrighted material

#### Concert Photos Bucket

Same policy structure as scores bucket.

**Security Characteristics:**
- Public gallery encourages sharing
- Admin-only upload prevents inappropriate content
- No venue-scoping (see RLS policies for concert_photos table for venue control)

### Storage Security Recommendations

1. **File Size Limits**: Enforce max file sizes (already implemented: 5MB for photos)
2. **File Type Validation**: Validate MIME types server-side before storage
3. **Path Naming**: Use structured paths like `{bucket}/{venue_id}/{file_id}` for organization
4. **Virus Scanning**: Consider integrating file scanning for uploaded content
5. **Content Moderation**: Implement review workflow for public-facing content

---

## Edge Cases Analysis

### Edge Case 1: Performer Viewing Another's Booking

**Scenario:**
Performer A tries to access Performer B's booking details directly (e.g., via URL manipulation or API call).

**Protection Layers:**

1. **RLS Policy** (Primary Defense):
```sql
CREATE POLICY "Users can view their own bookings"
ON bookings FOR SELECT
USING (profile_id = auth.uid());
```
- Database returns empty result set for unauthorized bookings
- Performer A cannot query Performer B's bookings at all

2. **Application Layer** (Secondary Defense):
```typescript
// In src/lib/hooks.ts - useMyUpcomingBookings()
const { data: bookings } = await supabase
  .from("bookings")
  .select("*")
  .eq("performer_id", user.id); // Explicitly filter by current user
```

**Test Verification:**
```
✓ Performer A cannot see Performer B's bookings in UI
✓ API call with Performer B's booking ID returns 404/403
✓ Direct SQL query as Performer A returns no rows for Performer B
```

**Verdict:** ✅ SECURE - Multiple layers of protection

---

### Edge Case 2: Editing Booking After 24-Hour Cutoff

**Scenario:**
Performer tries to edit/cancel booking with less than 24 hours until concert start time.

**Protection Layers:**

1. **RLS Policy** (Broad):
```sql
CREATE POLICY "Users can update their own bookings before concert starts"
ON bookings FOR UPDATE
USING (
  profile_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM concerts
    WHERE id = bookings.concert_id
    AND starts_at > NOW()
  )
);
```
- Prevents updates after concert starts
- Does NOT enforce 24-hour cutoff (allows updates up until concert)

2. **Application Layer** (Strict - 24 Hour Cutoff):
```typescript
// In src/lib/bookings/actions.ts - updateBooking()
const concert = booking.concert as any;
const concertDateTime = new Date(`${concert.scheduled_date}T${concert.start_time}`);
const now = new Date();
const hoursUntilConcert = (concertDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

if (hoursUntilConcert < 24) {
  return { error: "Cannot modify booking within 24 hours of concert start time" };
}
```

**Important:** Application layer is MORE restrictive than RLS. RLS allows edits up to concert start, but application prevents edits within 24 hours.

**Test Verification:**
```
✓ Performer can edit booking with 25+ hours remaining
✓ Performer cannot edit booking with 23 hours remaining (blocked by application)
✓ Edit button disabled/hidden in UI when within 24-hour window
✓ Direct API call within 24 hours returns error message
✓ After concert starts, RLS policy blocks any updates
```

**Potential Issue:**
- Performer could theoretically bypass application layer and call database directly
- **Mitigation**: Would need to modify RLS policy to enforce 24-hour rule at database level

**Recommendation:**
Enhance RLS policy to match application logic:
```sql
CREATE POLICY "Users can update their own bookings before 24-hour cutoff"
ON bookings FOR UPDATE
USING (
  profile_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM concerts
    WHERE id = bookings.concert_id
    AND starts_at > NOW() + INTERVAL '24 hours'
  )
);
```

**Verdict:** ⚠️ MOSTLY SECURE - Application layer enforces strict rule, but RLS could be tighter

---

### Edge Case 3: Admin Viewing Concerts from Other Venues

**Scenario:**
Admin assigned to Venue A tries to view/manage concerts for Venue B.

**Protection Layers:**

1. **RLS Policy** (Concert View):
```sql
-- Admins can see all concerts for their role, but...
CREATE POLICY "Admins and super admins can update concerts"
ON concerts FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);
```
⚠️ **ISSUE**: This policy allows ANY admin to update ANY concert, regardless of venue assignment!

2. **RLS Policy** (Booking View - Venue-Scoped):
```sql
CREATE POLICY "Admins can view bookings for their venues"
ON bookings FOR SELECT
USING (
  auth.uid() IN (
    SELECT av.profile_id
    FROM admins_venues av
    JOIN concerts c ON c.venue_id = av.venue_id
    WHERE c.id = bookings.concert_id
  )
);
```
✅ Correctly scoped to admin's assigned venues

3. **Application Layer** (Backend Protection):
```typescript
// In src/lib/admin/actions.ts - getAdminConcerts()
const { data: concerts } = await supabase
  .from("concerts")
  .select(`
    *,
    venue:venue_id!inner (*)
  `)
  .in(
    "venue_id",
    venues.map((v: any) => v.venue_id)
  ); // Only fetch concerts for admin's venues
```

**Current Behavior:**
- ✅ Admin UI only shows concerts for assigned venues (application filter)
- ✅ Admin can only view bookings for assigned venues (RLS)
- ⚠️ Admin COULD potentially update concerts for other venues if they bypass UI (RLS too permissive)

**Recommendation:**
Enhance concert update policy to be venue-scoped:
```sql
CREATE POLICY "Admins can update concerts for their venues"
ON concerts FOR UPDATE
USING (
  auth.uid() IN (
    SELECT av.profile_id
    FROM admins_venues av
    WHERE av.venue_id = concerts.venue_id
  )
  OR
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'super_admin'
  )
);
```

**Test Verification:**
```
✓ Admin for Venue A sees only Venue A concerts in UI
✓ Admin for Venue A can view bookings only for Venue A concerts
⚠️ Admin for Venue A could update Venue B concert if they bypass UI
  (Would be blocked with recommended RLS enhancement)
✓ Super admin can view/update all concerts
```

**Verdict:** ⚠️ VULNERABILITY IDENTIFIED - RLS policy for concert updates is not venue-scoped

---

### Edge Case 4: Super Admin Override

**Scenario:**
Super admin needs to perform administrative actions across all venues.

**Expected Behavior:**
- ✅ View all profiles, concerts, bookings, service hours
- ✅ Update any booking regardless of time restrictions
- ✅ Manage venue admin assignments
- ✅ Grant/revoke permissions

**Protection Layers:**

1. **RLS Policies** - Super admin has separate policies for most tables:
```sql
-- Example from bookings
CREATE POLICY "Super admins can view all bookings"
ON bookings FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'super_admin'
  )
);
```

2. **Application Layer** - Service role bypasses RLS for critical operations:
```typescript
// In src/lib/super/actions.ts
function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Bypasses RLS
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function verifySuperAdmin() {
  const supabase = await createServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile.role !== "super_admin") {
    throw new Error("Unauthorized");
  }
}
```

**Security Characteristics:**
- Service role key must NEVER be exposed to client-side code
- Always verify super_admin role before using service role client
- All super admin actions logged via granted_by/checked_by foreign keys

**Test Verification:**
```
✓ Super admin can view all concerts across all venues
✓ Super admin can update any booking (even after concert starts)
✓ Super admin can promote users to super_admin role
✓ Super admin can grant venue access to admins
✓ Service role key not accessible from browser DevTools
✓ Non-super-admin attempting super actions receives 403
```

**Verdict:** ✅ SECURE - Proper authorization checks before using elevated privileges

---

## Security Test Checklists

### 1. Profile Access Tests

**Test ID: PROF-001 - Own Profile Access**
- [ ] Performer can view their own profile
- [ ] Performer can update their own full_name
- [ ] Performer cannot view other performers' profiles
- [ ] Performer cannot change their own role

**Test ID: PROF-002 - Admin Profile Access**
- [ ] Admin can view performer profiles
- [ ] Admin cannot view other admin profiles
- [ ] Admin cannot update other users' profiles
- [ ] Admin cannot change any user's role

**Test ID: PROF-003 - Super Admin Profile Access**
- [ ] Super admin can view all profiles
- [ ] Super admin can update any profile
- [ ] Super admin can promote user to super_admin
- [ ] Super admin can grant venue admin access

### 2. Venue Access Tests

**Test ID: VEN-001 - Public Venue Access**
- [ ] Anonymous user can view active venues
- [ ] Anonymous user cannot view inactive venues
- [ ] Anonymous user cannot create venues

**Test ID: VEN-002 - Admin Venue Access**
- [ ] Admin can view all venues (active and inactive)
- [ ] Admin can create new venues
- [ ] Admin can update venues
- [ ] Admin cannot delete venues (no delete policy)

**Test ID: VEN-003 - Venue Admin Assignments**
- [ ] Admin can view their own venue assignments
- [ ] Admin cannot grant themselves access to new venues
- [ ] Super admin can grant venue access to any admin
- [ ] Super admin can revoke venue access

### 3. Booking Access Tests

**Test ID: BOOK-001 - Performer Booking Isolation**
- [ ] Performer A can view their own bookings
- [ ] Performer A cannot view Performer B's bookings
- [ ] Performer A can create booking for upcoming concert
- [ ] Performer A cannot create booking for another performer

**Test ID: BOOK-002 - Booking Time Restrictions**
- [ ] Performer can edit booking with 48 hours remaining
- [ ] Performer can edit booking with 25 hours remaining
- [ ] Performer CANNOT edit booking with 23 hours remaining (application layer)
- [ ] Performer CANNOT edit booking with 23 hours remaining (API call)
- [ ] Performer CANNOT edit booking after concert starts (RLS layer)
- [ ] Performer can cancel booking with 25+ hours remaining
- [ ] Performer CANNOT cancel booking with 23 hours remaining

**Test ID: BOOK-003 - Admin Booking Access**
- [ ] Admin can view bookings for their assigned venues only
- [ ] Admin cannot view bookings for other venues
- [ ] Admin can update booking status (confirmed/performed/absent)
- [ ] Admin can update booking AFTER concert ends (status changes)
- [ ] Super admin can view all bookings across all venues

### 4. Concert Management Tests

**Test ID: CONC-001 - Concert Visibility**
- [ ] Anonymous user can view scheduled concerts
- [ ] Authenticated user can view all concerts (scheduled/completed/cancelled)
- [ ] Concert list filtered by date range correctly

**Test ID: CONC-002 - Admin Concert Management**
- [ ] Admin can create concert for their assigned venue
- [ ] Admin can view concerts for their assigned venue
- [ ] Admin SHOULD NOT be able to update concerts for other venues (⚠️ RLS gap)
- [ ] Admin can mark attendance for their venue's concert
- [ ] Admin can upload photos for their venue's concert

**Test ID: CONC-003 - Concert Completion**
- [ ] Admin can complete concert with all requirements met
- [ ] Admin CANNOT complete concert without marked attendance
- [ ] Admin CANNOT complete concert without group photo
- [ ] Service hours automatically granted on completion
- [ ] Thank you emails sent to performed performers

### 5. Storage Access Tests

**Test ID: STOR-001 - Score Bucket Access**
- [ ] Anonymous user can download sheet music PDFs
- [ ] Performer can download sheet music PDFs
- [ ] Performer CANNOT upload sheet music
- [ ] Admin can upload sheet music PDFs
- [ ] Admin can update/delete sheet music files
- [ ] Super admin can upload/update/delete sheet music

**Test ID: STOR-002 - Audio Bucket Access**
- [ ] Anonymous user can access reference audio files
- [ ] Performer can stream/download audio files
- [ ] Performer CANNOT upload audio files
- [ ] Admin can upload audio files
- [ ] File type validation rejects non-audio files

**Test ID: STOR-003 - Photo Bucket Access**
- [ ] Anyone can view concert photos
- [ ] Performer CANNOT upload concert photos
- [ ] Admin can upload concert photos for their venue
- [ ] Photo size limited to 5MB (application layer)
- [ ] Image file types validated (JPG, PNG only)

### 6. Service Hours Tests

**Test ID: SERV-001 - Service Hours Access**
- [ ] Performer can view their own service hours
- [ ] Performer can export their service hours to CSV
- [ ] Performer cannot view other performers' service hours
- [ ] Performer cannot grant themselves service hours

**Test ID: SERV-002 - Service Hours Granting**
- [ ] Admin can grant service hours for their venue's concerts
- [ ] Admin cannot grant service hours for other venues
- [ ] Super admin can grant service hours for any concert
- [ ] Duplicate service hours prevented (profile_id + concert_id unique)
- [ ] granted_by field correctly records granting admin

### 7. Edge Case Tests

**Test ID: EDGE-001 - Cross-Performer Access**
```sql
-- As Performer A (user_id_a), attempt to query Performer B's booking
SELECT * FROM bookings WHERE performer_id = 'user_id_b';
-- Expected: 0 rows returned (RLS blocks)
```
- [ ] Query returns 0 rows
- [ ] No error message leaks booking existence

**Test ID: EDGE-002 - Time-Based Cutoff**
```bash
# Set system time to 23 hours before concert
# Attempt to update booking via API
curl -X PATCH /api/bookings/{id} -d '{"piece_stage_id": "new_id"}'
# Expected: 403 or error message
```
- [ ] API returns error about 24-hour cutoff
- [ ] Database does NOT update (application blocked it)

**Test ID: EDGE-003 - Venue Boundary**
```typescript
// As Admin for Venue A
// Attempt to view bookings for Venue B concert
const { data } = await supabase
  .from("bookings")
  .select("*")
  .eq("concert_id", "venue_b_concert_id");
```
- [ ] Query returns 0 rows (RLS blocks)
- [ ] Admin UI does not show Venue B concerts

**Test ID: EDGE-004 - Role Escalation Attempt**
```typescript
// As regular performer
// Attempt to update own role to super_admin
const { error } = await supabase
  .from("profiles")
  .update({ role: "super_admin" })
  .eq("id", myUserId);
```
- [ ] Update fails (RLS blocks non-super-admin role changes)
- [ ] Role remains "performer"

### 8. Super Admin Override Tests

**Test ID: SUPER-001 - Cross-Venue Access**
- [ ] Super admin can view concerts for all venues
- [ ] Super admin can update bookings for any venue
- [ ] Super admin can grant service hours for any concert

**Test ID: SUPER-002 - Time Restriction Override**
- [ ] Super admin can update booking after 24-hour cutoff
- [ ] Super admin can update booking after concert ends
- [ ] Super admin actions logged with timestamp

**Test ID: SUPER-003 - Role Management**
- [ ] Super admin can promote user to super_admin
- [ ] Super admin can grant venue admin access
- [ ] Super admin can revoke venue admin access
- [ ] Super admin cannot be locked out (self-role-change prevention)

---

## Recommendations

### Critical (Fix Immediately)

1. **🔴 CRITICAL: Fix Concert Update RLS Policy**
   - Current policy allows any admin to update any concert
   - Add venue-scoping to concert update policy
   - See "Edge Case 3" for recommended policy

2. **🔴 CRITICAL: Enhance 24-Hour Cutoff at Database Level**
   - Current RLS only prevents updates after concert starts
   - Application enforces 24-hour rule, but RLS should match
   - See "Edge Case 2" for recommended policy

### High Priority

3. **🟠 Add Venue-Scoped Concert Insert Policy**
   - Currently all admins can create concerts for any venue
   - Should restrict to admin's assigned venues only

4. **🟠 Implement Audit Logging Table**
   - Create `audit_log` table for sensitive operations
   - Log all role changes, venue assignments, service hour grants
   - Include timestamp, actor, action, and affected user/resource

5. **🟠 Add Rate Limiting**
   - Implement rate limiting on booking creation
   - Prevent bulk booking attempts
   - Limit failed login attempts

### Medium Priority

6. **🟡 File Upload Validation**
   - Add virus scanning for uploaded files
   - Implement content moderation workflow for concert photos
   - Add MIME type validation server-side

7. **🟡 Session Management**
   - Implement session timeout for inactive users
   - Add multi-device session management
   - Provide "log out all devices" functionality

8. **🟡 Two-Factor Authentication**
   - Add 2FA requirement for admin and super_admin roles
   - Support TOTP (Time-based One-Time Password)
   - Provide backup codes for account recovery

### Low Priority

9. **🟢 Enhanced Logging**
   - Log all RLS policy denials
   - Monitor for suspicious access patterns
   - Create security dashboard for super admins

10. **🟢 IP Allowlisting for Super Admins**
    - Optional IP restrictions for super_admin access
    - Configurable allowlist per super admin
    - Alert on access from new IPs

---

## Security Contact

For security concerns or to report vulnerabilities, please contact:
- **Email**: security@musicup.example.com
- **Response Time**: Within 24 hours for critical issues

---

## Appendix: Testing Procedures

### Manual Testing Setup

1. **Create Test Users:**
```sql
-- Performer A
INSERT INTO profiles (id, email, full_name, role)
VALUES ('test-performer-a', 'performer-a@test.com', 'Performer A', 'performer');

-- Performer B
INSERT INTO profiles (id, email, full_name, role)
VALUES ('test-performer-b', 'performer-b@test.com', 'Performer B', 'performer');

-- Admin for Venue 1
INSERT INTO profiles (id, email, full_name, role)
VALUES ('test-admin-1', 'admin-1@test.com', 'Admin 1', 'admin');

INSERT INTO admins_venues (profile_id, venue_id)
VALUES ('test-admin-1', 'venue-1-id');

-- Super Admin
INSERT INTO profiles (id, email, full_name, role)
VALUES ('test-super', 'super@test.com', 'Super Admin', 'super_admin');
```

2. **Create Test Data:**
- Create 2 venues (Venue A, Venue B)
- Create upcoming concerts for both venues
- Create past concerts for testing time restrictions

3. **Run Test Suite:**
```bash
# Run automated E2E tests
pnpm run test:e2e

# Run security-specific tests
pnpm run test:security
```

### Automated Testing

Consider using Playwright tests (already in place) to automate security test checklists:

```typescript
// tests/e2e/security.spec.ts
test('Performer cannot view other performer bookings', async ({ page }) => {
  // Login as Performer A
  await page.goto('/performer');

  // Attempt to access Performer B's booking URL directly
  const response = await page.goto('/api/bookings/performer-b-booking-id');

  // Expect 404 or 403
  expect(response?.status()).toBeGreaterThanOrEqual(400);
});
```

---

**Document Version:** 1.0
**Last Updated:** 2025-01-05
**Next Review:** Quarterly or after major security updates
