# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Primary development:**

- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all applications
- `pnpm start` - Start production server (runs migrations first)
- `pnpm test` - Run tests with Vitest
- `pnpm lint` - Lint all projects
- `pnpm format:check` - Check code formatting
- `pnpm format:write` - Auto-format code

**Database operations:**

- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:migrate` - Deploy migrations to production
- `pnpm prisma:migrate:dev` - Create and apply migrations in development

**Internationalization:**

- `pnpm messages:extract` - Extract translatable strings using LinguiJS
- `pnpm crowdin:sync` - Sync translations with Crowdin

**Individual project commands (using nx):**

- `nx serve client` - Start client development server
- `nx serve server` - Start server development server
- `nx serve artboard` - Start artboard development server
- `nx build [project]` - Build specific project
- `nx lint [project]` - Lint specific project
- `nx test [project]` - Test specific project

**Testing commands:**

- `pnpm test` - Run all tests with Vitest
- `nx test [project]` - Run tests for specific project
- Tests use Vitest for libs and Jest for server/Node.js code

**Container management (Docker/Podman):**

- `podman compose up -d` - Start all services in background
- `podman compose down` - Stop all services
- `podman compose up --build -d app` - Rebuild and restart app container
- `podman logs [container-name]` - View container logs
- `podman ps` - List running containers

## Architecture Overview

This is a monorepo built with **Nx** containing a full-stack resume builder application with three main applications and shared libraries.

### Applications (`apps/`)

1. **client** - Main React frontend (Vite + React Router)

   - User authentication, dashboard, resume builder UI
   - Built with React 18, TanStack Query, Zustand for state management
   - Uses Radix UI components and Tailwind CSS

2. **server** - NestJS backend API

   - Authentication (JWT, OAuth with GitHub/Google, 2FA)
   - Resume CRUD operations, file storage, PDF generation
   - PostgreSQL database with Prisma ORM
   - Swagger API documentation

3. **artboard** - Separate React app for resume rendering/preview
   - Isolated environment for resume templates and PDF generation
   - Template system with multiple pre-built designs

### Shared Libraries (`libs/`)

- **schema** - Zod schemas for resume data validation and type safety
- **dto** - Data Transfer Objects shared between client and server
- **ui** - Reusable React components built on Radix UI
- **utils** - Utility functions organized by namespace (array, color, date, etc.)
- **hooks** - Custom React hooks
- **parser** - Resume import parsers (JSON Resume, LinkedIn, etc.)

### Key Technologies

- **Frontend**: React 18, Vite, React Router, TanStack Query, Zustand
- **Backend**: NestJS, Prisma ORM, PostgreSQL
- **UI**: Radix UI primitives, Tailwind CSS, Framer Motion
- **Rich Text**: TipTap editor for resume content editing
- **PDF Generation**: Puppeteer via Browserless Chrome
- **Storage**: MinIO for file uploads
- **Internationalization**: LinguiJS with Crowdin
- **Authentication**: Passport.js with JWT, OAuth (GitHub/Google), TOTP 2FA
- **Testing**: Vitest (frontend/libs), Jest (backend)

### Database Schema

Uses Prisma with PostgreSQL. Key models:

- `User` - User accounts with multiple auth providers
- `Resume` - Resume documents with JSON data storage
- `Secrets` - Encrypted user credentials and tokens
- `Statistics` - Usage tracking data

### Path Aliases

The project uses TypeScript path aliases defined in `tsconfig.base.json`:

- `@/client/*` → `apps/client/src/*`
- `@/server/*` → `apps/server/src/*`
- `@/artboard/*` → `apps/artboard/src/*`
- `@reactive-resume/[lib]` → `libs/[lib]/src/index.ts`

### Development Environment

Uses Docker Compose for development dependencies:

- PostgreSQL database
- MinIO for object storage
- Redis for caching
- Browserless Chrome for PDF generation

**Environment Requirements:**
- Node.js >=20.13.1
- pnpm package manager (configured version: 9.1.3)
- Docker/Podman for development services

**Important Configuration Notes:**
- PDF generation requires `CHROME_IGNORE_HTTPS_ERRORS=true` in compose.yml for container networking
- Set `NODE_ENV=development` to disable production security middleware that can interfere with internal service communication
- Artboard serves resume templates for PDF generation via `/artboard/preview` route

### Template System

Resume templates are React components in `apps/artboard/src/templates/`. Each template:

- Takes standardized resume data schema
- Renders to HTML/CSS for PDF generation
- Supports customizable themes and layouts

### State Management

- **Client**: Zustand stores for auth, resume builder, dialogs
- **Server**: NestJS modules with dependency injection
- **Data fetching**: TanStack Query for client-server state sync

When making changes, ensure compatibility across the monorepo and run `pnpm lint` before committing.

### Common Issues & Solutions

**PDF Generation Problems:**
- If PDF generation fails with SSL errors, check `CHROME_IGNORE_HTTPS_ERRORS=true` in compose.yml
- Ensure artboard static serving is configured correctly in `apps/server/src/app.module.ts`
- Chrome container logs can help debug navigation issues: `podman logs reactive-resume-chrome-1`

**Container Networking:**
- Services communicate via internal Docker network using service names (e.g., `app:3000`, `minio:9000`)
- URL replacement logic in printer service handles localhost→service name mapping
- Use `podman compose up --build -d app` after configuration changes

## Notion Collaboration

This project uses Notion as a collaborative workspace for development documentation and issue tracking. Claude Code can programmatically create, read, and update Notion pages using the Notion API.

### Configuration

Notion settings are configured in `.env`:

- `NOTION_BEARER_TOKEN` - API authentication token
- `NOTION_PARENT_PAGE_ID` - Main database ID for the project workspace
- `NOTION_API_BASE` - Notion API base URL
- `NOTION_VERSION` - API version (2022-06-28)

### Workspace Structure

- **Main Database**: Reactive Resume development workspace (see `NOTION_PARENT_PAGE_ID` in .env)
- **Registry**: `/docs/knowledge/doc_registry.md` - Tracks all created pages
- **Guide**: `/docs/knowledge/notion-collaboration-guide.md` - Complete collaboration workflow

### Content Creation Workflow

1. **Write Markdown**: Create content in `.md` format for local documentation
2. **Convert to JSON**: Transform to Notion API block structure
3. **Store Templates**: Save in `/docs/knowledge/*.json` for reusability
4. **API Upload**: Use JSON files with curl to create/update Notion content
5. **Update Registry**: Add new pages to `doc_registry.md`

### Key API Endpoints

- **Database Info**: `GET /v1/databases/{id}`
- **Query Database**: `POST /v1/databases/{id}/query`
- **Create Page**: `POST /v1/pages`
- **Append Content**: `PATCH /v1/blocks/{page_id}/children`

### File Organization

```
docs/knowledge/
├── doc_registry.md                          # Page registry
├── notion-collaboration-guide.md            # Complete workflow guide
├── {project}-{type}.md                      # Local markdown files
├── {project}-{type}-notion.json             # Notion API payloads
└── *.json                                   # Content templates
```

### Usage Notes

- Always test token permissions before bulk operations
- Maintain local markdown copies as backups
- Update registry after creating new pages
- Use database endpoints for workspace queries
- Check permissions if encountering 404 errors

**Important**: When pages are moved between workspaces or converted to databases, sharing permissions may need to be reset.
