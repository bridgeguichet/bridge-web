# Services Feature Module

## Overview

This feature module provides an interactive service selection experience for the Diaspora user journey. It allows users to explore available services, select multiple services, and receive intelligent pack recommendations based on their selections.

## Architecture

### Components

#### `ServiceCard`
- **Purpose**: Display individual service with selection state
- **Features**: 
  - Checkbox-style selection indicator
  - Price badge display
  - Subcategory label
  - Hover and selected states
  - Responsive design

#### `PackRecommendation`
- **Purpose**: Display recommended service packs in the right panel
- **Features**:
  - Match percentage calculation
  - Visual indication of included services
  - Price display with monthly indicator for subscriptions
  - CTA button to select entire pack
  - Gradient background for visual hierarchy

#### `SelectionSummary`
- **Purpose**: Show selected services with total estimate
- **Features**:
  - Scrollable list of selected services
  - Remove individual services
  - Clear all functionality
  - Total price estimation
  - Sticky positioning in right panel

#### `ServiceSelectionSection`
- **Purpose**: Main orchestration component
- **Features**:
  - Service filtering by user profile
  - Category-based grouping
  - Progressive disclosure (show more/less)
  - Dynamic pack detection
  - Responsive grid layout
  - State management for selections

### Data Models

#### `Service`
```typescript
{
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  price?: string;
  relevantFor: string[]; // User profiles
}
```

#### `ServicePack`
```typescript
{
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  services: string[]; // Service IDs
  valueProposition: string;
  relevantFor: string[]; // User profiles
}
```

### Utilities

#### `detectMatchingPacks()`
- Analyzes selected services against available packs
- Calculates match percentage (minimum 50% to qualify)
- Applies profile-based scoring boost
- Returns sorted packs by relevance

#### `getRelevantServices()`
- Filters services based on user profile
- Returns all services if no profile specified

#### `groupServicesByCategory()`
- Organizes services by category
- Returns Map for efficient lookups

## User Experience Flow

1. **Initial State**: User completes 4-step profile journey
2. **Service Exploration**: 
   - Recommended services shown by default (filtered by profile)
   - Services grouped by category
   - Progressive disclosure with "Show more" buttons
3. **Selection**: 
   - Click service cards to select/deselect
   - Visual feedback with border and background changes
   - Selection summary appears in right panel
4. **Pack Detection**: 
   - As user selects services, matching packs appear
   - Packs sorted by relevance and match percentage
   - Visual indication of which selected services are included
5. **Pack Selection**: 
   - User can select entire pack with one click
   - All pack services added to selection
6. **Finalization**: 
   - User proceeds to payment with selected services

## Integration

### In Diaspora Page

```tsx
import { ServiceSelectionSection } from "@/features/services";

// After step 4 completion
{currentStep === 4 && isStepComplete() && (
  <div className="mt-12 pt-12 border-t">
    <ServiceSelectionSection userProfile={selectedProject} />
  </div>
)}
```

### User Profiles

The system recognizes these profiles:
- `court-sejour` - Short stay
- `installation` - Permanent installation
- `investissement` - Investment
- `exploration` - Exploration

Services and packs are filtered based on these profiles.

## Styling

All components use:
- Existing Tailwind CSS utilities
- Design tokens from `globals.css`
- shadcn/ui components (Card, Button, Badge)
- Consistent spacing and typography
- Responsive breakpoints (mobile-first)

## Performance Considerations

- `useMemo` for expensive computations (filtering, grouping, pack detection)
- Efficient Set operations for selection state
- Lazy rendering with progressive disclosure
- Sticky positioning for right panel (no scroll listeners)

## Future Enhancements

- Persist selections to backend/localStorage
- Add service comparison feature
- Implement search/filter functionality
- Add service categories icons
- Support for service dependencies
- Multi-language support via i18next
