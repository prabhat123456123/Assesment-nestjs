
Overview
This project is a backend service developed using NestJS to manage user authentication, Doctor management, and ingestion controls. The service is designed to facilitate seamless interaction between the NestJS backend and a Python-based ingestion backend using a microservices architecture. Below is a detailed breakdown of the project, including the APIs, architecture, tools, and implementation steps.

1. Project Purpose
The primary purpose of this project is to create a robust backend service that provides the following functionalities:

User Authentication: Register, login, logout, and role-based access control (admin, editor, viewer).
Doctor Management: CRUD (Create, Read, Update, Delete) operations for documents, including the ability to upload documents.
Ingestion Controls: Trigger and manage the ingestion process in the Python backend via APIs and webhooks.

2. Key APIs
2.1 Authentication APIs
These APIs handle user authentication and role-based access control.

Endpoints:
POST /signup:
Purpose: Registers a new user.
Request Body: SignUpDto (contains user details like email, password, role, etc.).

Response: Returns the created User object.

POST /login:
Purpose: Authenticates a user and generates a JWT token.
Request Body: LoginDto (contains email and password).

Response: Returns a JWT token and a success message.

GET /logout:
Purpose: Logs out the user by invalidating the session or token.

Response: Returns a success message.

2.2 Doctor Management APIs
These APIs allow admins to manage user roles and permissions.

Endpoints:
GET /doctor:
Purpose: Retrieves a list of all doctors (users with the doctor role).
Access: Restricted to users with VIEWER or ADMIN roles.

Query Parameters: Supports filtering, sorting, and pagination via ExpressQuery.

POST /doctor:
Purpose: Creates a new doctor (user with the doctor role).
Access: Restricted to users with the ADMIN role.

Request Body: CreateDoctorDto (contains doctor details).

GET /doctor/:id:
Purpose: Retrieves details of a specific doctor by ID.
Response: Returns the Doctor object.

PUT /doctor/:id:
Purpose: Updates details of a specific doctor by ID.
Access: Restricted to users with the EDITOR or ADMIN roles.
Request Body: UpdateDoctorDto (contains updated doctor details).

DELETE /doctor/:id:
Purpose: Deletes a specific doctor by ID.
Access: Restricted to users with the ADMIN role.
Response: Returns a confirmation object ({ deleted: boolean }).

PUT /doctor/upload/:id:
Purpose: Uploads images for a specific doctor.
Access: Authenticated users only.

File Validation: Accepts only jpg, jpeg, or png files with a maximum size of 1MB.

Response: Returns the updated Doctor object with the uploaded images.

POST /document/upload:

Purpose: Uploads a document.

Access: Authenticated users only.

File Validation: Accepts specific file types and sizes (e.g., PDF, DOCX).

Response: Returns the uploaded document details.

2.4 Ingestion APIs
These APIs trigger and manage the ingestion process in the Python backend.

Endpoints:
POST /ingestion/trigger:
Purpose: Triggers the ingestion process.
Request Body: { source: string, webhookUrl?: string } (contains the data source and optional webhook URL).

Response: Returns an ingestionId and the status (IN_PROGRESS).

GET /ingestion/status/:id:
Purpose: Retrieves the status of an ongoing ingestion process.
Response: Returns the ingestion status (IN_PROGRESS, COMPLETED, or NOT_FOUND).

3. Implementation Details
3.1 Authentication and Authorization
JWT (JSON Web Tokens): Used for user authentication and role-based authorization.

Guards:
AuthGuard: Ensures that only authenticated users can access protected routes.
RolesGuard: Restricts access based on user roles (ADMIN, EDITOR, VIEWER).

3.2 Database Integration
PostgreSQL: Used as the primary database for storing user and document data.

Sequelize: Used for database operations and entity management.

3.3 File Upload
Multer: Handles file uploads for document and image uploads.

File Validation:
File type: Only specific file types (e.g., jpg, jpeg, png, pdf) are allowed.
File size: Maximum file size is limited (e.g., 1MB for images).

3.4 Ingestion Process
Webhooks: Used to notify the Python backend about the ingestion status.

Ingestion Tracking: Ongoing ingestion processes are tracked using a Map in the IngestionService.

4. Tech Stack
NestJS: Backend framework for building scalable and modular applications.

TypeScript: Ensures type safety and improves code maintainability.

PostgreSQL: Relational database for storing structured data.

JWT: Handles user authentication and authorization.

Microservices Architecture: Facilitates communication between NestJS and the Python backend.

Sequelize: Object-Relational Mapping (ORM) tool for database operations.
Multer: Middleware for handling file uploads.

Axios: HTTP client for sending webhook notifications.

5. Steps Followed
5.1 Project Setup
Initialize NestJS Project:

Created a new NestJS project using the Nest CLI.

Set up the project structure with modules, controllers, and services.

Database Configuration:

Integrated PostgreSQL using Sequelize.

Defined entities for User, Doctor, and Document.

Authentication Setup:

Implemented JWT-based authentication.
Created AuthGuard and RolesGuard for role-based access control.

5.2 API Development
Authentication APIs:

Implemented /signup, /login, and /logout endpoints.
Added validation for request bodies using DTOs.

User Management APIs:
Implemented CRUD operations for doctors.
Added role-based access control for each endpoint.

Document Management APIs:
Added file upload functionality with validation.

Ingestion APIs:
Implemented /ingestion/trigger and /ingestion/status/:id endpoints.
Added webhook support for notifying the Python backend.

5.3 Testing and Validation
Unit Testing:
Wrote unit tests for controllers and services using Jest.

Integration Testing:
Tested API endpoints using tools like Postman.

Validation:
Added validation for request bodies, query parameters, and file uploads.

6. Conclusion
This project successfully implements a robust backend service using NestJS, providing user authentication, Doctor management, and ingestion controls. The use of a microservices architecture ensures seamless communication with the Python backend, while the integration of PostgreSQL, JWT, and Sequelize ensures scalability and security. Detailed documentation and testing further enhance the maintainability and reliability of the service.


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



