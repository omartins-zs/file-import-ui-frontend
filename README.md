# File Import UI - Frontend

Modern, professional dashboard for managing and tracking file imports.

## Features
- **Dashboard**: Real-time stats and metrics of current imports.
- **Async Tracking**: Polls the backend to show real-time progress of file processing.
- **Preview System**: View spreadsheet contents before confirmed upload.
- **Detailed Logs & Errors**: Drill down into row-by-row validation errors.
- **Responsive & Modern**: Built with Next.js, Tailwind, and Framer Motion for a premium SaaS feel.

## Stack
- **Next.js**: App Router, TypeScript
- **Tailwind CSS**: Modern styling
- **TanStack Query (React Query)**: Data fetching and state management
- **Axios**: HTTP requests
- **Framer Motion**: Micro-animations and transitions
- **Lucide React**: Premium icon set

## How to Run

### Docker
```bash
docker-compose up -d
```

### Native (Development)
1. Install dependencies: `npm install`
2. Set up `.env` (copy from `.env.example`)
3. Run: `npm run dev`
4. Access at: `http://localhost:3000`

## Implementation Notes
- Uses **Polling** (via React Query `refetchInterval`) for real-time progress updates.
- Centralized API service in `src/lib/api.ts`.
- Componentized architecture for modals, cards, and layouts.
- Form-less file uploads using **React Dropzone**.
