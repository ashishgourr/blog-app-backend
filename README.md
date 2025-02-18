# Blog App Backend

This is the backend for the Blog App, built using Node.js, Express, and MongoDB.

## Features

- User authentication (JWT)
- CRUD operations for blog posts
- Authorization checks to ensure users can only modify their own posts
- Secure API endpoints

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/ashishgourr/blog-app-backend.git
   ```

2. Navigate to the backend directory:

   ```sh
   cd blog-app-backend
   ```

3. Install dependencies:
   ```sh
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Running the Server

To start the server in development mode:

```sh
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive a JWT token

### Blog Posts

- `GET /api/posts` - Get all blog posts
- `GET /api/posts/:id` - Get a specific blog post by ID
- `POST /api/posts` - Create a new blog post (Authenticated users only)
- `PUT /api/posts/:id` - Update a blog post (Only the owner can update)
- `DELETE /api/posts/:id` - Delete a blog post (Only the owner can delete)
