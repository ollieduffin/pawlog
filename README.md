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

- **Creation and last-edited timestamps on log entries, shown in the UI** — `LogEntry` already has `createdAt` in the schema, but it isn't currently displayed anywhere. There's also no `updatedAt` field yet to track when a log was last edited — would need a schema change (`updatedAt DateTime @updatedAt`) plus a migration, then surfacing both dates on `LogListItem`.

- **Recurring reminders** (e.g. "medication every 8 hours") — the `Reminder` model has `recurring`/`recurrenceRule` fields in the schema, but they're not implemented: no recurrence UI, no logic to auto-generate the next occurrence once one is marked complete. Deferred deliberately, not just for scope — recurrence has limited practical value without push/email notifications actively surfacing it at the right moment (otherwise a short-cycle recurring reminder is just a label sitting in a list, no different from a one-off). Reminders are more useful as-is for longer-timeframe, one-off things (a vet visit, an annual check-up), which the current schema already supports well. If built, this would pair naturally with the spec's other stretch goal — email notifications via Resend — rather than standing alone.

- **Field-specific frontend error reporting** — every API route currently returns one generic validation message (e.g. "Reminder entry not valid") regardless of which field actually failed, and every form displays that single message rather than highlighting the specific input at fault. Zod's `safeParse` failure already carries this detail — `result.error.issues` (or the `.flatten()` helper) gives a per-field breakdown — it's just not surfaced yet. Deferred since wiring it properly means changes on both ends: API routes returning structured per-field errors, and every form (`FormInput` and its consumers) knowing how to display an error against one specific input rather than the form as a whole.

## Testing

## Local Instructions
