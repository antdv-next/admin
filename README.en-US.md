# Antdv Next Admin

Antdv Next Admin is an admin system template built on top of the Antdv Next component library. It provides a set of prebuilt pages and components to help developers quickly build admin systems.

## Features

- Built with the Antdv Next component library, with a rich set of UI components and styles.
- Includes prebuilt pages and components to speed up admin system development.
- Supports backend mock data for easier development and testing.
- Provides Nitro backend service support, so small projects do not need to run a separate backend service.
- AI-friendly, with rich `admin/skills` support to help AI understand the framework better.

## Installation

This project uses `vite-plus` as the base framework by default, and it is based on `pnpm`. You can still install the project with other package managers if needed:

```bash
## vite-plus
vp install
## npm
npm install
## yarn
yarn install
## pnpm
pnpm install
```

## Usage

We provide a ready-to-use base framework that you can extend, or you can directly use the provided pages and components to build your admin system.

```bash
# Do not omit "run" when using vp
vp run dev

# Or use pnpm directly
pnpm dev
```

## Build

There are two build modes: a frontend-only build and a fullstack integrated build.

### Frontend-only Build

If you do not need the backend service features provided by this project, you can disable Nitro by setting `VITE_APP_NITRO_ENABLED=false`. The resulting build will be a pure frontend project that can be deployed to any static file server.

### Fullstack Integrated Build

If you need the backend service features provided by this project, you can enable Nitro by setting `VITE_APP_NITRO_ENABLED=true`. The resulting build will be a fullstack integrated project that can be deployed to a Node.js-capable server.

You can also deploy it with `serverless` to cloud functions. For deployment details, refer to the official Nitro documentation.

The build output will be generated in the `.output` directory. Use Node.js to start the project:

```bash
node ./.output/server/index.mjs
```

## AI Support

If you are a heavy AI user, it is recommended to install the following skills first:

```shell
# General skills
npx skills add antfu/skills

# Antdv Next skills
npx slills add antdv-next/skills
```

## Removal

Every removable feature in this project includes a `remove.md` file. If you do not want to remove a feature manually, you can feed that document to an AI model and let it help remove the corresponding feature.

Note: removal quality depends on the model you use. It is recommended to use `codex` or `claude code`, specifically models such as `gpt5.4/gpt5.3-codex` or `ops-4.6`, for better removal quality. Removal quality is not guaranteed with other models or vendors.
