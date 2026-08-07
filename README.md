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

## Testing

## Local Instructions
