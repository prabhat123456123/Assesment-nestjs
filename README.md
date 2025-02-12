
## Description

Project Overview

This project is a backend service built using NestJS to manage user authentication, document management, and ingestion controls. It follows a microservices architecture, enabling seamless communication between NestJS and a Python-based ingestion backend.


1. Authentication APIs

User Registration
Login & Logout
Role-based access control (Admin, Editor, Viewer)

2. Document Management APIs

Create, Read, Update, and Delete (CRUD) operations for documents
Upload document functionality

3. Ingestion APIs

Ingestion Trigger API: Triggers the ingestion process in the Python backend via a webhook or API call.
Ingestion Management API: Tracks and manages ongoing ingestion processes.

Tech Stack

NestJS - Backend framework
TypeScript - For type safety
PostgreSQL - Database
JWT - Authentication & authorization
Microservices Architecture - Enables communication with the Python backend

## Installation

$ npm install

npx sequelize-cli migration:generate --name create-users-table
npx sequelize-cli db:migrate

## Running the app

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```



