# NestJS Authentication API

This project is a NestJS-based API that implements a robust authentication system using JWT (JSON Web Tokens). It includes features such as user registration, login, token refresh, and protected routes.

## Features

- User registration and login
- JWT-based authentication
- Token refresh mechanism
- Protected routes
- PostgreSQL database integration
- Docker support for easy deployment

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Docker and Docker Compose (for containerized setup)
- PostgreSQL (if running without Docker)

## Setup

### Environment Variables

Create a `.env` file in the root directory with the following variables:

PORT=8000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
AT_SECRET=your_access_token_secret
RT_SECRET=your_refresh_token_secret
Optional: Use this for a single database URL connection
DB_URL=postgres://username:password@host:port/database
This README provides a comprehensive overview of your project, including setup instructions for both local and Docker environments, a list of main features, API endpoints, and important development notes. You may want to customize it further based on any specific details or requirements of your project.
add in README.md

Certainly! I'll add the project-specific information to the README.md file. Here's an updated version that includes details about your authentication system and setup instructions:
PORT=8000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
AT_SECRET=your_access_token_secret
RT_SECRET=your_refresh_token_secret
Optional: Use this for a single database URL connection
DB_URL=postgres://username:password@host:port/database
bash
unit tests
$ npm run test
e2e tests
$ npm run test:e2e
test coverage
$ npm run test:cov
This README now includes:
A brief description of your project and its features
Prerequisites for running the project
Setup instructions for both local and Docker environments
A list of API endpoints
Information about the authentication mechanism
Development notes
Testing instructions
You can further customize this README to include any additional information specific to your project or development workflow.
add readme file here which setup project required env and all guide also postman collection

```PORT=8000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
AT_SECRET=your_access_token_secret
RT_SECRET=your_refresh_token_secret
Optional: Use this for a single database URL connection
DB_URL=postgres://username:password@host:port/database
```
bash
unit tests
$ npm run test
e2e tests
$ npm run test:e2e
test coverage
$ npm run test:cov
This README provides a comprehensive guide for setting up and using your NestJS Authentication API project. It includes:
Project description and features
Prerequisites
Setup instructions (both local and Docker)
Required environment variables
API endpoints
A Postman collection for easy testing
Development notes
Testing instructions
Contribution guidelines
License information
You can further customize this README to include any additional information specific to your project or development workflow.
