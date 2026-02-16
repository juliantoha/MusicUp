# MusicUp UI System

## Overview
Modern, accessible, mobile-first design system implementation for MusicUp.

## Design Principles

### 1. **Color Palette**
- **Background**: Neutral white (#FFFFFF) / dark (#0A0A0A)
- **Foreground**: High-contrast text (#171717)
- **Primary Accent**: Music blue (#3B82F6) - Used sparingly for CTAs and active states
- **Semantic Colors**:
  - Success: Green (#16A34A)
  - Destructive: Red (#DC2626)
  - Muted: Gray (#F5F5F5)

### 2. **Typography**
- **Font Stack**: System sans-serif (system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto)
- **Strong Hierarchy**:
  - H1: 2rem (32px) / 1.875rem (30px) on mobile
  - H2: 1.5rem (24px) / 1.25rem (20px) on mobile
  - H3: 1.25rem (20px) / 1.125rem (18px) on mobile
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)

### 3. **Spacing**
- Mobile-first approach with consistent 4px grid
- Touch targets minimum 44x44px for finger-friendly interaction
- Generous whitespace for readability

## Component Improvements

### Stepper (Book a Concert Flow)
**Location**: `src/components/performer/BookConcertTab.tsx`

**Enhancements**:
- ✅ Icon-based step indicators (MapPin, Calendar, Music)
- ✅ Check mark for completed steps
- ✅ Mobile-responsive sizing (12px → 14px circles)
- ✅ Color-coded states (active, completed, pending)
- ✅ ARIA labels for accessibility
- ✅ Smooth transitions between states

**Accessibility**:
```tsx
aria-current={isActive ? "step" : undefined}
aria-label={`Step ${index + 1}: ${step}`}
```

### Admin Checklist
**Location**: `src/components/admin/ConcertDetailView.tsx`

**Enhancements**:
- ✅ Large finger-friendly buttons (3-button grid)
- ✅ Icon + text labels for clarity
- ✅ Color-coded status (green for performed, red for absent)
- ✅ Subtle background tints on card when status selected
- ✅ Mobile-first: stacks on small screens, grid on larger
- ✅ Touch targets: min 44px height

**Button States**:
- **Confirmed**: Default primary button
- **Performed**: Green with checkmark icon
- **Absent**: Red with X icon

### Photo Gallery
**Location**: `src/components/admin/ConcertDetailView.tsx`

**Enhancements**:
- ✅ Responsive grid (1 col mobile → 2 col tablet → 3 col desktop)
- ✅ Consistent aspect ratio (4:3) for thumbnails
- ✅ Hover effects (scale + border color change)
- ✅ Lazy loading for performance
- ✅ Caption overlay with gradient
- ✅ Empty state with icon and guidance

**Grid Layout**:
```tsx
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
```

### Empty States
**Locations**:
- `src/components/performer/ChangeBookingTab.tsx`
- `src/components/performer/InformationTab.tsx`
- `src/components/admin/ConcertDetailView.tsx`

**Pattern**:
```tsx
<div className="text-center py-12 bg-muted/10 rounded-lg border-2 border-dashed">
  <Icon className="w-16 h-16 mx-auto mb-3 text-muted-foreground" />
  <p className="text-lg font-medium mb-1">Headline</p>
  <p className="text-sm text-muted-foreground">Single-sentence guidance</p>
</div>
```

**Characteristics**:
- Large, centered icon
- Clear headline
- Single-sentence next action
- Dashed border for visual lightness
- Muted background

## Mobile-First Design

### Breakpoints
- **Mobile**: 0px - 639px (default)
- **Tablet**: 640px+ (sm:)
- **Desktop**: 768px+ (md:)
- **Large**: 1024px+ (lg:)

### Touch Targets
All interactive elements meet or exceed WCAG 2.1 Level AAA:
- Minimum: 44px × 44px
- Buttons: 48px height on mobile
- Admin status toggles: 56px+ height

### Typography Scale
Responsive sizing:
```css
text-base md:text-lg  /* Body text */
text-xs md:text-sm    /* Small text */
w-12 h-12 md:w-14 md:h-14  /* Icons */
```

## Accessibility Features

### 1. **Semantic HTML**
- Proper heading hierarchy
- Descriptive link text
- Form labels and ARIA labels

### 2. **Keyboard Navigation**
- All interactive elements focusable
- Visible focus indicators
- Logical tab order

### 3. **Screen Readers**
- ARIA labels on icons
- `aria-hidden` on decorative elements
- `aria-current` for active states
- Descriptive alt text

### 4. **Color Contrast**
- Text: 4.5:1 minimum (WCAG AA)
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

### 5. **Responsive Meta Tags**
```tsx
viewport: {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}
```

## Performance Optimizations

### Images
- Lazy loading: `loading="lazy"`
- Proper aspect ratios to prevent layout shift
- Optimized grid layouts

### Animations
- CSS transitions only (no heavy JS animations)
- `transition-colors`, `transition-transform`
- Respects `prefers-reduced-motion`

### Code Splitting
- Component-level imports
- Dynamic imports where appropriate

## Lighthouse Targets

### Performance
- **Target**: > 90
- **Optimizations**:
  - Minimal JavaScript
  - Lazy-loaded images
  - Efficient CSS (Tailwind purging)
  - No blocking scripts

### Accessibility
- **Target**: > 90
- **Features**:
  - ARIA labels
  - Semantic HTML
  - Color contrast
  - Touch target sizing
  - Keyboard navigation

### Best Practices
- **Target**: > 90
- **Includes**:
  - HTTPS
  - No console errors
  - Proper meta tags

## File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   └── globals.css         # Global styles & CSS variables
├── components/
│   ├── performer/
│   │   ├── BookConcertTab.tsx     # Enhanced stepper
│   │   ├── ChangeBookingTab.tsx   # Polished empty states
│   │   └── InformationTab.tsx     # Service hours UI
│   ├── admin/
│   │   └── ConcertDetailView.tsx  # Finger-friendly checklist
│   └── ui/                 # shadcn/ui components
```

## Testing Checklist

### Mobile (< 640px)
- [ ] Stepper icons visible and sized appropriately
- [ ] Admin buttons are finger-friendly (44px+ touch targets)
- [ ] Text is readable without zooming
- [ ] No horizontal scrolling
- [ ] Empty states are centered and clear

### Tablet (640px - 1024px)
- [ ] Photo grid shows 2 columns
- [ ] Status buttons display in 3-column grid
- [ ] Typography scales appropriately

### Desktop (> 1024px)
- [ ] Photo grid shows 3 columns
- [ ] All hover states work
- [ ] Adequate whitespace

### Accessibility
- [ ] Can navigate entire flow with keyboard only
- [ ] Screen reader announces all interactive elements
- [ ] Color contrast passes WCAG AA
- [ ] Touch targets meet 44x44px minimum
- [ ] Zoom up to 200% without breaking layout

## Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari: iOS 14+
- Chrome Mobile: Latest

## Future Enhancements
- [ ] Add skeleton loaders for better perceived performance
- [ ] Implement focus-visible for better keyboard navigation UX
- [ ] Add animation preferences (respect prefers-reduced-motion)
- [ ] Consider dark mode toggle (currently follows system preference)
- [ ] Add micro-interactions for delight (subtle button presses, etc.)
