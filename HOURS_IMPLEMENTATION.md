# Service Hours Implementation

## Overview
Enhanced the Information tab to show service hours grouped by year with totals and CSV export functionality.

## Features

### 1. Yearly Grouping
Service hours are now grouped by the year of the concert date:
- Hours are automatically grouped by the year from `concert.scheduled_date`
- Years are displayed in descending order (most recent first)
- Each year shows its own total

### 2. Totals Calculation
- **All-Time Total**: Sum of all service hours across all years
- **Yearly Totals**: Sum of service hours for each individual year
- **Pending Hours**: Sum of hours with status='pending' (separate from totals)

### 3. Math Example
As specified in the requirements:
- 2 concerts completed with 3.0 hours each = 6.0 hours
- Add one more concert with 3.0 hours = 9.0 hours total

The calculation is straightforward:
```typescript
const allTimeTotal = serviceHours.reduce((sum, sh) => sum + sh.hours, 0);
```

For yearly totals:
```typescript
const yearTotal = yearHours.reduce((sum, sh) => sum + sh.hours, 0);
```

### 4. CSV Export
Clicking "Export CSV" generates a downloadable CSV file with the following columns:
- **Date**: Concert date (MM/DD/YYYY format)
- **Venue**: Venue name
- **Series**: Concert series name
- **Hours**: Service hours awarded (decimal)
- **Concert ID**: UUID of the concert
- **Admin**: Full name or email of the admin who approved the hours

The CSV file is named: `service_hours_YYYY-MM-DD.csv` (with current date)

## UI Components

### Summary Cards
Three cards at the top show:
1. **All-Time Total** (green) - Total hours across all time
2. **Pending Hours** (yellow) - Hours awaiting approval
3. **Total Concerts** (blue) - Number of completed concerts

### Yearly Breakdown
For each year:
- Year header with year total
- Table of all service hours for that year
- Sorted by date (most recent first within year)
- Shows: Date, Concert (series), Venue, Hours, Status

### Export Button
Located in the top-right of the Hours card, enabled when service hours exist.

## Data Flow

1. `useMyServiceHours()` fetches all service hours with concert, venue, series, and approver details
2. `groupServiceHoursByYear()` organizes hours into year buckets
3. `calculateHoursTotal()` sums hours for display
4. `exportToCSV()` generates and downloads CSV file

## Files Modified
- `/src/components/performer/InformationTab.tsx` - Enhanced with yearly grouping and CSV export

## Testing

### Manual Test Steps
1. Log in as a performer who has completed concerts
2. Navigate to Information tab
3. Verify yearly totals match sum of hours in each year
4. Verify all-time total matches sum of all yearly totals
5. Click "Export CSV"
6. Open downloaded CSV file
7. Verify columns: Date, Venue, Series, Hours, Concert ID, Admin
8. Verify data matches what's shown in the UI
9. Calculate totals in spreadsheet - should match UI totals

### Test Data Example
```
Year 2024:
- Concert 1: 3.0 hours
- Concert 2: 3.0 hours
Year Total: 6.0 hours

Year 2023:
- Concert 3: 3.0 hours
Year Total: 3.0 hours

All-Time Total: 9.0 hours ✓
```

## Acceptance Criteria

✅ **CSV downloads and opens cleanly**
- CSV uses proper formatting with quoted fields
- Headers are clear and descriptive
- File downloads with date-stamped filename

✅ **Totals match the sum in the table**
- All-time total = sum of all yearly totals
- Yearly total = sum of all hours in that year
- Math is accurate to 1 decimal place

✅ **Math example verified**
- 2 concerts × 3 hours = 6 hours
- Add 1 concert × 3 hours = 9 hours total
- Formula: `sum(service_hours.hours)` grouped by year
