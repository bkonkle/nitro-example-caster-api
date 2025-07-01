# nitro-example-caster-api

[<img alt="Node.js" src="https://img.shields.io/badge/node-v22-brightgreen?logo=node.js&style=flat" />](https://nodejs.org/en/)
[<img alt="TypeScript" src="https://img.shields.io/github/package-json/dependency-version/bkonkle/nitro-example-caster-api/dev/typescript?logo=typescript&style=flat&color=3178c6" />](https://www.typescriptlang.org/)
[<img alt="Nitro" src="https://img.shields.io/npm/v/nitropack?logo=nuxt&style=flat&color=ea2845&label=nitro" />](https://nitro.build/)
[<img alt="Prisma" src="https://img.shields.io/npm/v/@prisma/client?logo=prisma&style=flat&color=38a169&label=prisma" />](https://www.prisma.io/)

This is an example app to test out [Nitro](https://nitro.build/) deployment on Vercel. It implements a basic REST API to support a number of hypothetical client apps for an imaginary "Caster" app - a tool to help podcasters, broadcasters, and streamers coordinate show content with their co-hosts and guests. Limited to just the API to support those hypothetical clients.

## API Features

- Create and log into a user account, and save a personal profile.
- Create a show with episodes.
- Create topics to discuss within an episode.

## Libraries & Tools

- [Vercel](https://vercel.com/)
- [Nitro](https://nitro.build/)
- [Prisma](https://www.prisma.io/)
- [TSX](https://tsx.is/typescript)
- [CASL](https://casl.js.org/)
- [Convict](https://github.com/mozilla/node-convict)
- [Turborepo](https://turborepo.com/)
- [pnpm](https://pnpm.io/)
- [Biome](https://biomejs.dev/)
- [Localstack](https://localstack.cloud/)

## Local Development

After checking out the repository, install dependencies with [pnpm](https://pnpm.io/):

```sh
pnpm i
```

Then, follow the example in [.envrc.example](services/api/.envrc.example) to create your own `services/api/.envrc` file for [direnv](https://direnv.net/).

```sh
cd services/api

cp .envrc.example .envrc

direnv allow
```

### Authentication

Authentication uses a standard OAuth2 JWKS setup that relies on an external identity server to issue and validate tokens. To start off you'll need an OAuth2 endpoint, something like `https://my-app.us.auth0.com` (if you're using Auth0) or `https://mydomain.auth.us-east-1.amazoncognito.com` (if you're using AWS Cognito). Set this as the `AUTH_URL` variable in your `services/api/.envrc`.

Then, set the `AUTH_AUDIENCE` to `localhost`, or whatever your authentication provider prefers.

### DB Setup

Use [Docker Compose](https://docs.docker.com/compose/) to launch a local Postgres database by running:

```sh
cd services/api

pnpm docker up -d
```

Then, run migrations to catch your schema up to the latest:

```sh
pnpm db.migrate
```

The first time you do this on a fresh database, you should see:

```sh
PostgreSQL database caster created at localhost:1701
```

And finally:

```sh
Your database is now in sync with your schema.
```

### Running the Local Server

Use `pnpm` to run the server locally:

```sh
cd services/api

pnpm dev
```
