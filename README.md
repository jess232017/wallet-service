# Wallet Service

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

A robust wallet service built with [NestJS](https://github.com/nestjs/nest) that provides wallet management and transaction capabilities. This service allows users to create wallets, manage balances, and perform financial transactions with proper validation and error handling.

## Features

- **Wallet Management**

  - Create new wallets with custom names
  - Retrieve wallet information and balance
  - List all wallets
  - Update wallet details
  - Delete wallets

- **Transaction Management**

  - Deposit funds to wallets
  - Withdraw funds from wallets
  - Transaction history tracking
  - Optimistic locking for concurrent operations

- **Technical Features**
  - RESTful API with Swagger documentation
  - TypeORM for database operations
  - Unit of Work pattern for transaction management
  - Input validation and error handling
  - Optimistic locking for concurrent operations
  - Comprehensive test coverage
  - Docker support for easy deployment and development

## Project Setup

### Local Development

```bash
# Install dependencies
$ pnpm install

# Set up environment variables
Create a .env file with the following variables:
- DATABASE_URL=your_database_connection_string
- PORT=3000 (or your preferred port)
```

### Docker Setup

The project includes Docker support for both development and production environments.

#### Building the Docker Image

```bash
# Build the Docker image
$ docker build -t wallet-service .
```

#### Running with Docker

```bash
# Run the container
$ docker run -p 3000:3000 \
    -e DATABASE_URL=your_database_connection_string \
    -e PORT=3000 \
    wallet-service
```

#### Docker Compose (Recommended)

Create a `docker-compose.yml` file in your project root:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/wallet
      - PORT=3000
    depends_on:
      - db
    healthcheck:
      test:
        [
          'CMD',
          'wget',
          '--no-verbose',
          '--tries=1',
          '--spider',
          'http://localhost:3000/api/health',
        ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s

  db:
    image: postgres:15-alpine
    ports:
      - '5432:5432'
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=wallet
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Then run:

```bash
# Start the services
$ docker-compose up -d

# View logs
$ docker-compose logs -f

# Stop the services
$ docker-compose down
```

## Running the Application

### Local Development

```bash
# Development
$ pnpm run start

# Watch mode
$ pnpm run start:dev

# Production mode
$ pnpm run start:prod
```

### Docker Development

```bash
# Build and start the services
$ docker-compose up -d

# Rebuild and restart after changes
$ docker-compose up -d --build
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/api
```

## Testing

```bash
# Unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# Test coverage
$ pnpm run test:cov
```

## Architecture

The project follows a clean architecture approach with:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Implement business logic
- **Repositories**: Manage data access
- **DTOs**: Define data transfer objects
- **Entities**: Represent database models
- **Unit of Work**: Manage transactions and data consistency

## Error Handling

The service implements comprehensive error handling for:

- Invalid input data
- Insufficient funds
- Concurrent operations
- Not found resources
- Database errors

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

### Docker Deployment

For production deployment using Docker:

1. Build the production image:

```bash
$ docker build -t wallet-service:prod .
```

2. Run the container with production settings:

```bash
$ docker run -d \
    --name wallet-service \
    -p 3000:3000 \
    -e NODE_ENV=production \
    -e DATABASE_URL=your_production_database_url \
    wallet-service:prod
```

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

This project is [MIT licensed](LICENSE).
