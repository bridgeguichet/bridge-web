# Quick Integration Example - Retraite Journey

This document shows exactly how to add the appointment booking step to the existing Retraite journey.

## Step 1: Import Dependencies

Add these imports at the top of `src/app/(external)/retraite/page.tsx`:

```tsx
import { AppointmentStep } from "@/features/appointment";
import type { AppointmentData } from "@/features/appointment";
```

## Step 2: Add State

Add appointment state after your existing state declarations:

```tsx
const [appointment, setAppointment] = useState<AppointmentData>({
  date: undefined,
  timeSlot: undefined,
});
```

## Step 3: Update Step Validation

Modify your `isStepValid` function to include step 8:

```tsx
const isStepValid = (step: number) => {
  switch (step) {
    case 1:
      return selectedCity !== "";
    case 2:
      return selectedProject !== "";
    case 3:
      return selectedPension !== "";
    case 4:
      return selectedLifestyle !== "";
    case 5:
      return needsHealthFollowup !== "";
    case 6:
      return needsSecureHousing !== "";
    case 7:
      return true; // Services selection is optional
    case 8: // NEW: Appointment step
      return appointment.date !== undefined && appointment.timeSlot !== undefined;
    default:
      return false;
  }
};
```

## Step 4: Add Step Rendering

Add the appointment step rendering after step 7 (services selection):

```tsx
{currentStep === 8 && (
  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
    <AppointmentStep
      onAppointmentChange={setAppointment}
      selectedServicesCount={selectedServices.size}
      totalEstimate={totalEstimate}
    />
  </div>
)}
```

## Step 5: Update Navigation Logic

Modify your "Next" button to handle step 8:

```tsx
<Button
  onClick={() => {
    if (currentStep === 8) {
      // Proceed to payment with all data
      console.log("Journey data:", {
        city: selectedCity,
        project: selectedProject,
        pension: selectedPension,
        lifestyle: selectedLifestyle,
        healthFollowup: needsHealthFollowup,
        secureHousing: needsSecureHousing,
        services: Array.from(selectedServices),
        appointment: appointment,
      });
      // TODO: Navigate to payment page or API call
      alert("Prêt pour le paiement!");
    } else {
      setCurrentStep(currentStep + 1);
    }
  }}
  disabled={!isStepValid(currentStep)}
  className="gap-2"
>
  {currentStep === 8 ? "Procéder au paiement" : "Suivant"}
  <ArrowRight className="w-4 h-4" />
</Button>
```

## Step 6: Update Step Indicator

If you have a step indicator, update it to show 8 steps instead of 7:

```tsx
const totalSteps = 8; // Changed from 7

// Update step labels
const stepLabels = [
  "Ville cible",
  "Type de projet",
  "Pension mensuelle",
  "Niveau de vie",
  "Suivi santé",
  "Logement sécurisé",
  "Services",
  "Rendez-vous", // NEW
];
```

## Complete Example

Here's a minimal complete example showing the key changes:

```tsx
"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceSelectionSection } from "@/features/services";
import { AppointmentStep } from "@/features/appointment";
import type { AppointmentData } from "@/features/appointment";

export default function RetraitePage() {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Existing state
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedServices, setSelectedServices] = useState(new Set<string>());
  
  // NEW: Appointment state
  const [appointment, setAppointment] = useState<AppointmentData>({
    date: undefined,
    timeSlot: undefined,
  });

  const isStepValid = (step: number) => {
    switch (step) {
      case 1: return selectedCity !== "";
      // ... other cases
      case 7: return true;
      case 8: return appointment.date !== undefined && appointment.timeSlot !== undefined;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Step 7: Services */}
      {currentStep === 7 && (
        <ServiceSelectionSection userProfile="retraite" />
      )}

      {/* Step 8: Appointment - NEW */}
      {currentStep === 8 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <AppointmentStep
            onAppointmentChange={setAppointment}
            selectedServicesCount={selectedServices.size}
            totalEstimate={1800}
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {currentStep > 1 && (
          <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        )}
        <Button
          onClick={() => {
            if (currentStep === 8) {
              console.log("Payment data:", { appointment, services: selectedServices });
              // Navigate to payment
            } else {
              setCurrentStep(currentStep + 1);
            }
          }}
          disabled={!isStepValid(currentStep)}
        >
          {currentStep === 8 ? "Procéder au paiement" : "Suivant"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
```

## Testing the Integration

1. Navigate to `/retraite`
2. Complete steps 1-7
3. On step 8, you should see the appointment booking interface
4. Select a date from the calendar
5. Select a time slot
6. Verify the summary shows your appointment details
7. Click "Procéder au paiement"

## Data Flow

```
Retraite Page State
├─ selectedCity
├─ selectedProject
├─ selectedPension
├─ selectedLifestyle
├─ needsHealthFollowup
├─ needsSecureHousing
├─ selectedServices (Set<string>)
└─ appointment (AppointmentData) ← NEW
    ├─ date: Date
    └─ timeSlot: TimeSlot
        ├─ id: string
        ├─ time: string
        ├─ available: boolean
        └─ counselor: string
```

## Next Steps

After integration:
1. Test the complete flow
2. Add appointment data to payment API call
3. Store appointment in database
4. Send confirmation email
5. Sync with counselor calendar

## Same Pattern for All Journeys

This exact pattern works for:
- ✅ Diaspora (`/diaspora`)
- ✅ Expat (`/expat`)
- ✅ Investor (`/investisseur`)
- ✅ NextGen (`/nextgen`)
- ✅ Retraite (`/retraite`)

Just adjust the step number and state variables to match each journey's structure.
