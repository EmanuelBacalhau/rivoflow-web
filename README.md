# Orion Flow Web

Visual node editor for AI-powered image generation. Build image generation pipelines by connecting prompts, reference images, and AI generation nodes on an interactive canvas.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Visual Editor**: XYFlow (React Flow)
- **AI**: Google Gemini (image generation)
- **State**: React Context + TanStack Query
- **Storage**: AWS S3 (presigned upload URLs)
- **UI**: shadcn/ui + Tailwind CSS v4
- **Code Quality**: Biome (lint + format)
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- Google Gemini API key
- Access to the Orion Flow API (AWS API Gateway)

### Setup

```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env

# Fill in your values in .env, then run the dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_GOOGLE_AI_API_KEY` | Google Gemini API key for image generation | Yes |

See [.env.example](.env.example) for the full list.

## Project Structure

```
src/
├── app/                       # Next.js routes (App Router)
│   └── dashboard/flow/[id]/  # Flow editor page
├── components/
│   ├── nodes/                 # Flow node components
│   └── ui/                    # shadcn/ui primitives
├── contexts/
│   └── flow/                  # Flow state & controllers
│       └── controllers/       # Per-operation hooks (mutations)
├── services/                  # API layer (axios)
│   └── node/                  # Node-specific services
├── lib/                       # Third-party integrations (Google AI)
└── utils/                     # Shared utilities
```

## Available Scripts

| Command | Description |
|---|---|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun start` | Start production server |
| `bun lint` | Run Biome linter |
| `bun format` | Auto-format with Biome |
| `bun typecheck` | TypeScript type check |

## Architecture

### Node Types

| Type | Description |
|---|---|
| `PROMPT` | Text input node — provides prompt to generation |
| `IMAGE` | Image upload node — provides reference image via S3 |
| `GENERATION_IMAGE` | AI generation node — calls Google Gemini |
| `RESULT_IMAGE` | Output node — displays generated image |

### Key Patterns

- **Optimistic updates**: Nodes appear instantly, replaced with real ID on API success
- **Debouncing**: Position updates (300ms), prompt updates (1000ms)
- **Polling**: Generation nodes refetch every 5s while status is `queued` or `processing`
- **S3 presigned upload**: Client requests signed URL → uploads directly to S3

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org)
4. Open a pull request

Make sure `bun lint` and `bun typecheck` pass before submitting.
