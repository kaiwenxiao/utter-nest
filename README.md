<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Nestjs + Mikro-orm + PostgreSQL based backend powerful and reliable project template (UNDER CONSTRUCTION)</p>
    <p align="center">

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup](#Setup)
- [Running the app](#Running-the-app)
- [Why MikroORM](#Why-MikroORM)
- [Features(Under Construction)](#FeaturesUnder-Construction)

## Prerequisites

NodeJS
https://nodejs.org/en/

MikroORM
https://mikro-orm.io/

PostgresQL
https://www.postgresql.org/

## Setup

```
1. pnpm install

2. config your env file in `./env/**`. For remote database provider, you can simply using `clientUrl` conducted by your provider instead of 
   a batch of `DB_HOST` and `DB_NAME` etc, see `./env/.env.sample` and relative file (./src/lib/config/configs/database.config.ts)
   
3. MikroORM using in Nestjs was recommanded config by `MikroOrmModule` instead of `mikro-orm-cli` (https://mikro-orm.io/docs/usage-with-nestjs#installation)
```

## Running the app

```bash
# setup the desired environment in `package.json` to run the app
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Why MikroORM
The example codebase uses MikroORM with a Postgres database. Why Mikroorm? It is a modern ORM for Node.js based on Data Mapper, Unit of Work and Identity Map patterns. It is fully compatible with TypeScript and provides additional features like support for enums, custom types, MongoDB, transactions, caching, migrations, change tracking, advanced queries, lazy/eager relations and much more.

## Features(Under Construction)
- 🌐 [**I18n**](https://en.wikipedia.org/wiki/Internationalization_and_localization) - Internationalization
- 🧵 [**Stats**](https://github.com/slanatech/swagger-stats/) - Swagger stats for common server metrics
- 🧵 [**Poolifier**](https://github.com/poolifier/poolifier) - Threads for CPU extensive tasks
- 💬 [**Twilio**](https://github.com/twilio/twilio-node) - SMS support
- 📱 [**NestJS**](https://docs.nestjs.com) — Latest version
- 🎉 [**TypeScript**](https://www.typescriptlang.org/) - Type checking
- ⚙️ [**Dotenv**](https://github.com/motdotla/dotenv) - Supports environment variables
- 🗝 [**Authentication**](https://jwt.io/), [RSA256](https://tools.ietf.org/html/rfc7518#section-6.3), [OAuth]([https://oauth.net/](https://docs.nestjs.com/security/authentication) - JWT, RSA256, OAuth
- 🏬 [**Authorization**](https://github.com/stalniy/casl) - RBAC with casl
- 🏪 [**MikroORM**](https://mikro-orm.io/) - Database ORM
- 🏪 [**PostgreSQL**](https://www.postgresql.org/) - Open-Source Relational Database
- 🧠 [**Configuration**](https://docs.nestjs.com/techniques/configuration) - Single config for all
- 📃 [**Swagger**](https://swagger.io/) - API Documentation
- 🐳 [**Docker Compose**](https://docs.docker.com/compose/) - Container Orchestration
- 🔐 [**Helmet**](https://helmetjs.github.io/) - Secure HTTP headers
- 📏 [**ESLint**](https://eslint.org/) — Pluggable JavaScript linter
- ✅ [**Commitlint**](https://commitlint.js.org/) — Checks if your commit messages meet the conventional commit format.
- 🐺 [**Husky**](https://github.com/typicode/husky) — Helps you create Git hooks easily.

## License

Nest is [MIT licensed](LICENSE).
