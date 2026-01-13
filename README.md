# Microfrontend Hub

A hub application for micro frontends using Module Federation, Vite, and TanStack libraries.

## Architecture

This monorepo follows a modular architecture where:

- **Container App** - The main hub application that orchestrates and loads micro frontends
- **Micro Apps** - Independent applications that can be loaded into the container
- **Shared Libraries** - Common utilities and the micro app loader

## Project Structure

```
├── apps/                   # Micro applications
│   └── container/          # Main hub/container application
├── libraries/              # Shared libraries
│   └── loader/             # Micro app loader using Module Federation
├── pnpm-workspace.yaml     # Workspace configuration
├── tsconfig.base.json      # Shared TypeScript config
└── package.json            # Root package.json
```

## Tech Stack

- **Package Manager**: pnpm (workspaces)
- **Bundler**: Vite
- **Micro Frontends**: Module Federation (vite-plugin-federation)
- **Language**: TypeScript
- **Routing & State**: TanStack libraries

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

## License

MIT
