# PawLog

PawLog — a multi-pet health and training tracker for owners managing feeding, symptoms, and vet reminders.

I built this after adopting a puppy and wanting a single place to track feeding, symptoms, and vet reminders across multiple logs.

## Features

## Tech Stack

- **Next.js (App Router)** — file-based routing, server components for fast initial loads
- **TypeScript** — type safety across API routes and components
- **Prisma + Postgres** — relational data (pets → logs → reminders) fit a relational model better than NoSQL
- **NextAuth** — session-based auth without building it from scratch
- **TanStack Query** — caching/refetching for server state instead of manual `useEffect` wiring

## Data Model

```
User -> Pet -> LogEntry
            -> Reminder
            -> Breed
```

## Decision Notes

## Future Improvements

- **Shared confirmation dialog for pet deletion** — each `PetListItem` currently renders its own `<dialog>` for delete confirmation, which is simple and keeps each item self-contained, but doesn't scale well if a user's pet list grows large (many inert DOM nodes). At scale, a single shared dialog owned by `PetList`, driven by a "currently selected pet" piece of state, would be more efficient — deferred for now since it adds state-lifting complexity that isn't justified by this app's realistic pet-list size.

- **Type-specific fields on log entries** — the log entry form currently uses one generic `value` text field regardless of `type` (FEEDING/SYMPTOM/TRAINING/WEIGHT/NOTE). A more polished version would show different, more appropriate inputs depending on the selected type (e.g. a numeric field for WEIGHT, a free-text area for NOTE) — deferred for MVP simplicity, per the "don't gold-plate" guidance in the spec.

## Testing

## Local Instructions
