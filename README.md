# Blogging Site Backend - Project Guide

## Project Overview

This project focuses on building a **backend API** for a blogging platform using **Express.js** and **MongoDB**. The platform will handle **user management**, **blog creation**, **editing**, **deletion**, and **liking blogs**. It includes **JWT-based authentication** and **authorization** for secure access. Users will interact with the blogs by creating, viewing, updating, and deleting them.

---

## Key Features

1. **User Management**:

   - Register users with details such as first name, last name, email, and password.
   - Users will be required to log in with JWT authentication.

2. **Blog Management**:

   - Users can create, update, delete, and retrieve blogs.
   - Filtering options for blogs by author, category, tags, and subcategory.
   - Only non-deleted and published blogs can be retrieved in public requests.

3. **Likes on Blogs**:

   - Users can like a blog, which directly increases the like count.

4. **Authentication & Authorization**:
   - Authentication using JWT to protect routes.
   - Authorization ensures only users can manage their own blogs.

---

## Models

### 1. User Model

```yaml
{
  "fname": { "type": "String", "required": true },
  "lname": { "type": "String", "required": true },
  "email": { "type": "String", "required": true, "unique": true },
  "password": { "type": "String", "required": true, "minLength": 8 },
}
```

### 2. Blog Model

```yaml
{
  "title": { "type": "String", "required": true },
  "body": { "type": "String", "required": true },
  "userId": { "type": "ObjectId", "ref": "User", "required": true },
  "tags": { "type": ["String"] },
  "category": { "type": "String", "required": true, "enum": ["technology", "entertainment", "lifestyle", "food", "fashion"] },
  "subcategory": { "type": ["String"] }, //examples - ["web development", "AI", "ML"]
  "createdAt": { "type": "Date", "default": Date.now },
  "updatedAt": { "type": "Date", "default": Date.now },
  "deletedAt": { "type": "Date" },
  "isDeleted": { "type": "Boolean", "default": false },
  "publishedAt": { "type": "Date" },
  "isPublished": { "type": "Boolean", "default": false },
  "likeCount": { "type": "Number", "default": 0 }
}
```

---

## API Routes

### 1. User APIs

#### POST /users

- **Description**: Create a user.
- **Request Body**:
  ```json
  {
    "fname": "John",
    "lname": "Doe",
    "email": "johndoe@example.com",
    "password": "Password@123"
  }
  ```
- **Response**:
  - **Success**: `201 Created`, with the new user details.
  - **Error**: `400 Bad Request` if the request is invalid.

### 2. Blog APIs

#### POST /blogs

- **Description**: Create a new blog for a valid user.
- **Request Body**:
  ```json
  {
    "title": "Tech Trends 2024",
    "body": "Content of the blog...",
    "userId": "606c5cda8f072730f8b8b123",
    "tags": ["technology", "AI"],
    "category": "technology",
    "subcategory": ["web development", "AI"]
  }
  ```
- **Response**:
  - **Success**: `201 Created` with the newly created blog details.
  - **Error**: `400 Bad Request` for invalid input.

#### GET /blogs

- **Description**: Retrieve all published, non-deleted blogs, with filtering options.
- **Query Parameters**:
  - `userId`: Filter by user's ID.
  - `category`: Filter by category.
  - `tags`: Filter by tags.
  - `subcategory`: Filter by subcategory.
  - `page` : For **pagination**. Filter data by page number.
- **Response**:
  - **Success**: `200 OK` with the list of blogs.
  - **Error**: `404 Not Found` if no blogs match the filters.

#### PUT /blogs/:blogId

- **Description**: Update blog content, tags, subcategory, or publish status.
- **Request Body**:
  ```json
  {
    "title": "Updated Tech Trends",
    "body": "Updated content...",
    "tags": ["updatedTag"],
    "subcategory": ["updatedSubcategory"],
    "isPublished": true
  }
  ```  
- **Response**:
  - **Success**: `200 OK` with the updated blog details.
  - **Error**: `404 Not Found` if the blog doesn't exist.

#### DELETE /blogs/:blogId

- **Description**: Soft delete a blog by marking it as deleted.
- **Response**:
  - **Success**: `200 OK` with no content.
  - **Error**: `404 Not Found` if the blog doesn't exist.

#### DELETE /blogs/delete-all/:userid

- **Description**: Delete blogs based on query parameters like userId, category, tags, or unpublished status.
- **Response**:
  - **Success**: `200 OK` with no content.
  - **Error**: `404 Not Found` if no blogs match the criteria.

---

## Authentication & Authorization

### POST /login

- **Description**: Log in a user, returning a JWT token.
- **Request Body**:
  ```json
  {
    "email": "johndoe@example.com",
    "password": "Password@123"
  }
  ```
- **Response**:
  - **Success**: `200 OK` with JWT token.
  - **Error**: `401 Unauthorized` if credentials are incorrect.

### Middleware for Authentication & Authorization

1. **Authentication Middleware**:

   - Validates the JWT token on protected routes (create, update, delete blog).
   - Adds the `userId` to the request for further use.

2. **Authorization Middleware**:
   - Ensures only the owner of a blog can edit or delete it.
   - If unauthorized, returns `403 Forbidden`.

---

## Response Structure

### Successful Response

```json
{
  "status": true,
  "data": {}
}
```

### Error Response

```json
{
  "status": false,
  "msg": "Error message"
}
```

---

## Testing (Self-evaluation)

- Use **Postman** to test the API.