# Comprehensive API Documentation for Book Store Backend

This document provides a comprehensive overview of all API endpoints available in the Book Store Backend application, including their methods, parameters, request/response structures, and authentication requirements.

## Table of Contents
- [Authentication API](#authentication-api)
- [Author API](#author-api)
- [Cart API](#cart-api)
- [Category API](#category-api)
- [Dashboard API](#dashboard-api)
- [Order API](#order-api)
- [Product API](#product-api)
- [User API](#user-api)

## Authentication API

Base URL: `/auth`

### Register User
- **Method**: `POST`
- **Endpoint**: `/auth/register`
- **Description**: Register a new user account
- **Authentication**: Public (no token required)
- **Status Code**: 201 Created

#### Request
- **Body**: RegisterDto
  ```json
  {
    "fullName": "string (required)",
    "email": "string (required, valid email format)",
    "password": "string (required, minimum 6 characters)",
    "phoneNumber": "string (optional)"
  }
  ```

#### Response
- **Success Response**: 201 Created
  ```json
  {
    "accessToken": "string",
    "user": {
      "id": "string (UUID)",
      "fullName": "string",
      "email": "string",
      "phoneNumber": "string (optional)",
      "role": "Role enum",
      "createdAt": "date",
      "updatedAt": "date"
    }
  }
  ```

### Login User
- **Method**: `POST`
- **Endpoint**: `/auth/login`
- **Description**: Authenticate a user and return access token
- **Authentication**: Public (no token required)
- **Status Code**: 200 OK

#### Request
- **Body**: LoginDto
  ```json
  {
    "email": "string (required, valid email format)",
    "password": "string (required)"
  }
  ```

#### Response
- **Success Response**: 200 OK
  ```json
  {
    "accessToken": "string",
    "user": {
      "id": "string (UUID)",
      "fullName": "string",
      "email": "string",
      "phoneNumber": "string (optional)",
      "role": "Role enum",
      "createdAt": "date",
      "updatedAt": "date"
    }
  }
  ```

### Reset Password
- **Method**: `POST`
- **Endpoint**: `/auth/reset-password`
- **Description**: Reset a user's password using a token
- **Authentication**: Public (no token required)
- **Status Code**: 200 OK

#### Request
- **Body**: ResetPasswordDto
  ```json
  {
    "token": "string (required)",
    "newPassword": "string (required, minimum 6 characters)"
  }
  ```

#### Response
- **Success Response**: 200 OK
  ```json
  {
    "message": "string"
  }
  ```

## Author API

Base URL: `/authors`

### Get All Authors
- **Method**: `GET`
- **Endpoint**: `/authors`
- **Description**: Retrieve all authors with pagination
- **Authentication**: Public (no token required)
- **Status Code**: 200 OK

#### Request
- **Query Parameters**: PaginationQueryDto
  ```json
  {
    "page": "number (optional, default: 1)",
    "limit": "number (optional, default: 10)"
  }
  ```

#### Response
- **Success Response**: 200 OK
  ```json
  {
    "data": [
      {
        "id": "string (UUID)",
        "name": "string"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number",
    "totalPages": "number"
  }
  ```

### Get Author by ID
- **Method**: `GET`
- **Endpoint**: `/authors/:id`
- **Description**: Retrieve a specific author by ID
- **Authentication**: Public (no token required)
- **Status Code**: 200 OK

#### Response
- **Success Response**: 200 OK
  ```json
  {
    "id": "string (UUID)",
    "name": "string"
  }
  ```

### Create Author
- **Method**: `POST`
- **Endpoint**: `/authors`
- **Description**: Create a new author (Admin only)
- **Authentication**: JWT Bearer Token (Admin role required)
- **Status Code**: 201 Created

#### Request
- **Body**: CreateAuthorDto
  ```json
  {
    "name": "string (required)"
  }
  ```

#### Response
- **Success Response**: 201 Created
  ```json
  {
    "id": "string (UUID)",
    "name": "string"
  }
  ```

### Delete Author
- **Method**: `DELETE`
- **Endpoint**: `/authors/:id`
- **Description**: Delete an author by ID (Admin only)
- **Authentication**: JWT Bearer Token (Admin role required)
- **Status Code**: 200 OK

#### Response
- **Success Response**: 200 OK (No Content)

## Cart API

Base URL: `/cart`

### Get User's Cart
- **Method**: `GET`
- **Endpoint**: `/cart`
- **Description**: Retrieve the currently authenticated user's cart
- **Authentication**: JWT Bearer Token (User token required)
- **Status Code**: 200 OK

#### Response
- **Success Response**: 200 OK
  ```json
  {
    "id": "string (UUID)",
    "items": [
      {
        "id": "string (UUID)",
        "product": {
          "id": "string (UUID)",
          "title": "string",
          "description": "string (optional)",
          "price": "number",
          "rating": "number",
          "ratingCount": "number",
          "createdAt": "date",
          "updatedAt": "date",
          "categories": [
            {
              "id": "string (UUID)",
              "name": "string"
            }
          ],
          "authors": [
            {
              "id": "string (UUID)",
              "name": "string"
            }
          ]
        }
      }
    ],
    "total": "number",
    "createdAt": "date"
  }
  ```

### Add Item to Cart
- **Method**: `POST`
- **Endpoint**: `/cart`
- **Description**: Add a product to the user's cart
- **Authentication**: JWT Bearer Token (User token required)
- **Status Code**: 200 OK

#### Request
- **Body**: AddToCartDto
  ```json
  {
    "productId": "string (required, UUID format)"
  }
  ```

#### Response
- **Success Response**: 200 OK
  ```json
  {
    "id": "string (UUID)",
    "items": [
      {
        "id": "string (UUID)",
        "product": {
          "id": "string (UUID)",
          "title": "string",
          "description": "string (optional)",
          "price": "number",
          "rating": "number",
          "ratingCount": "number",
          "createdAt": "date",
          "updatedAt": "date",
          "categories": [
            {
              "id": "string (UUID)",
              "name": "string"
            }
          ],
          "authors": [
            {
              "id": "string (UUID)",
              "name": "string"
            }
          ]
        }
      }
    ],
    "total": "number",
    "createdAt": "date"
  }
  ```

### Remove Item from Cart
- **Method**: `DELETE`
- **Endpoint**: `/cart`
- **Description**: Remove an item from the user's cart
- **Authentication**: JWT Bearer Token (User token required)
- **Status Code**: 200 OK

#### Request
- **Body**: RemoveFromCartDto
  ```json
  {
    "productId": "string (required, UUID format)"
  }
  ```

#### Response
- **Success Response**: 200 OK
  ```json
  {
    "id": "string (UUID)",
    "product": {
      "id": "string (UUID)",
      "title": "string",
      "description": "string (optional)",
      "price": "number",
      "rating": "number",
      "ratingCount": "number",
      "createdAt": "date",
      "updatedAt": "date",
      "categories": [
        {
          "id": "string (UUID)",
          "name": "string"
        }
      ],
      "authors": [
        {
          "id": "string (UUID)",
          "name": "string"
        }
      ]
    }
  }
  ```

### Clear User's Cart
- **Method**: `DELETE`
- **Endpoint**: `/cart/clear`
- **Description**: Clear all items from the user's cart
- **Authentication**: JWT Bearer Token (User token required)
- **Status Code**: 200 OK

#### Response
- **Success Response**: 200 OK
  ```json
  {
    "id": "string (UUID)",
    "items": [],
    "total": 0,
    "createdAt": "date"
  }
  ```

## Category API

Base URL: `/categories`

### Get All Categories
- **Method**: `GET`
- **Endpoint**: `/categories`
- **Description**: Retrieve all categories with pagination
- **Authentication**: Public (no token required)
- **Status Code**: 200 OK

#### Request
- **Query Parameters**: PaginationQueryDto
  ```json
  {
    "page": "number (optional, default: 1)",
    "limit": "number (optional, default: 10)"
  }
  ```

#### Response
- **Success Response**: 200 OK
  ```json
  {
    "data": [
      {
        "id": "string (UUID)",
        "name": "string"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number",
    "totalPages": "number"
  }
  ```

### Create Category
- **Method**: `POST`
- **Endpoint**: `/categories`
- **Description**: Create a new category (Admin only)
- **Authentication**: JWT Bearer Token (Admin role required)
- **Status Code**: 201 Created

#### Request
- **Body**: CreateCategoryDto
  ```json
  {
    "name": "string (required)"
  }
  ```

#### Response
- **Success Response**: 201 Created
  ```json
  {
    "id": "string (UUID)",
    "name": "string"
  }
  ```

### Delete Category
- **Method**: `DELETE`
- **Endpoint**: `/categories/:id`
- **Description**: Delete a category by ID (Admin only)
- **Authentication**: JWT Bearer Token (Admin role required)
- **Status Code**: 200 OK

#### Response
- **Success Response**: 200 OK (No Content)

## Dashboard API

Base URL: `/dashboard`

### Get Dashboard Statistics
- **Method**: `GET`
- **Endpoint**: `/dashboard/stats`
- **Description**: Retrieve dashboard statistics (Admin only)
- **Authentication**: JWT Bearer Token (Admin role required)
- **Status Code**: 200 OK

#### Response
- **Success Response**: 200 OK
  ```json
  {
    "totalUsers": "number",
    "totalProducts": "number",
    "totalOrders": "number",
    "totalRevenue": "number"
  }
  ```

### Get Sales Over Time
- **Method**: `GET`
- **Endpoint**: `/dashboard/sales-over-time`
- **Description**: Retrieve sales data over time (Admin only)
- **Authentication**: JWT Bearer Token (Admin role required)
- **Status Code**: 200 OK

#### Response
- **Success Response**: 200 OK
  ```json
  [
    {
      "date": "string",
      "sales": "number"
    }
  ]
  ```

## Order API

Base URL: `/orders`

### Get All Orders (Admin)
- **Method**: `GET`
- **Endpoint**: `/orders/admin`
- **Description**: Retrieve all orders with pagination (Admin only)
- **Authentication**: JWT Bearer Token (Admin role required)
- **Status Code**: 200 OK

#### Request
- **Query Parameters**: PaginationQueryDto
  ```json
  {
    "page": "number (optional, default: 1)",
    "limit": "number (optional, default: 10)"
  }
  ```

#### Response
- **Success Response**: 200 OK
  ```json
  {
    "data": [
      {
        "id": "string (UUID)",
        "userId": "string (UUID)",
        "orderDate": "date",
        "totalAmount": "number",
        "status": "string",
        "items": [
          {
            "id": "string (UUID)",
            "product": {
              "id": "string (UUID)",
              "title": "string",
              "description": "string (optional)",
              "price": "number",
              "rating": "number",
              "ratingCount": "number",
              "createdAt": "date",
              "updatedAt": "date"
            },
            "price": "number"
          }
        ]
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number",
    "totalPages": "number"
  }
  ```

### Create New Order
- **Method**: `POST`
- **Endpoint**: `/orders`
- **Description**: Create a new order for the authenticated user
- **Authentication**: JWT Bearer Token (User token required)
- **Status Code**: 201 Created

#### Request
- **Body**: CreateOrderDto
  ```json
  {
    "items": [
      {
        "productId": "string (UUID)"
      }
    ],
    "cartId": "string (UUID)"
  }
  ```

#### Response
- **Success Response**: 201 Created
  ```json
  {
    "id": "string (UUID)",
    "userId": "string (UUID)",
    "orderDate": "date",
    "totalAmount": "number",
    "status": "string",
    "items": [
      {
        "id": "string (UUID)",
        "product": {
          "id": "string (UUID)",
          "title": "string",
          "description": "string (optional)",
          "price": "number",
          "rating": "number",
          "ratingCount": "number",
          "createdAt": "date",
          "updatedAt": "date"
        },
        "price": "number"
      }
    ]
  }
  ```

### Get User's Orders
- **Method**: `GET`
- **Endpoint**: `/orders`
- **Description**: Retrieve orders for the authenticated user
- **Authentication**: JWT Bearer Token (User token required)
- **Status Code**: 200 OK

#### Request
- **Query Parameters**: PaginationQueryDto
  ```json
  {
    "page": "number (optional, default: 1)",
    "limit": "number (optional, default: 10)"
  }
  ```

#### Response
- **Success Response**: 200 OK
  ```json
  {
    "data": [
      {
        "id": "string (UUID)",
        "userId": "string (UUID)",
        "orderDate": "date",
        "totalAmount": "number",
        "status": "string",
        "items": [
          {
            "id": "string (UUID)",
            "product": {
              "id": "string (UUID)",
              "title": "string",
              "description": "string (optional)",
              "price": "number",
              "rating": "number",
              "ratingCount": "number",
              "createdAt": "date",
              "updatedAt": "date"
            },
            "price": "number"
          }
        ]
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number",
    "totalPages": "number"
  }
  ```

### Cancel Order
- **Method**: `PUT`
- **Endpoint**: `/orders/cancel`
- **Description**: Cancel an order
- **Authentication**: JWT Bearer Token (User token required)
- **Status Code**: 200 OK

#### Request
- **Body**: CancelOrderDto
  ```json
  {
    "orderId": "string (required, UUID format)"
  }
  ```

#### Response
- **Success Response**: 200 OK
  ```json
  {
    "id": "string (UUID)",
    "userId": "string (UUID)",
    "orderDate": "date",
    "totalAmount": "number",
    "status": "string",
    "items": [
      {
        "id": "string (UUID)",
        "product": {
          "id": "string (UUID)",
          "title": "string",
          "description": "string (optional)",
          "price": "number",
          "rating": "number",
          "ratingCount": "number",
          "createdAt": "date",
          "updatedAt": "date"
        },
        "price": "number"
      }
    ]
  }
  ```

## Product API

Base URL: `/products`

### Get All Products
- **Method**: `GET`
- **Endpoint**: `/products`
- **Description**: Retrieve all products with filters and pagination
- **Authentication**: Public (no token required)
- **Status Code**: 200 OK

#### Request
- **Query Parameters**: ProductFilterQueryDto
  ```json
  {
    "page": "number (optional, default: 1)",
    "limit": "number (optional, default: 10)",
    "title": "string (optional)",
    "categoryIds": "array of strings (UUIDs, optional)",
    "minPrice": "number (optional)",
    "maxPrice": "number (optional)",
    "sortBy": "string (optional)",
    "sortOrder": "string (optional, enum: ASC, DESC)"
  }
  ```

#### Response
- **Success Response**: 200 OK
  ```json
  {
    "data": [
      {
        "id": "string (UUID)",
        "title": "string",
        "description": "string (optional)",
        "price": "number",
        "rating": "number",
        "ratingCount": "number",
        "createdAt": "date",
        "updatedAt": "date",
        "categories": [
          {
            "id": "string (UUID)",
            "name": "string"
          }
        ],
        "authors": [
          {
            "id": "string (UUID)",
            "name": "string"
          }
        ]
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number",
    "totalPages": "number"
  }
  ```

### Get Product by ID
- **Method**: `GET`
- **Endpoint**: `/products/:id`
- **Description**: Retrieve a specific product by ID
- **Authentication**: Public (no token required)
- **Status Code**: 200 OK

#### Response
- **Success Response**: 200 OK
  ```json
  {
    "id": "string (UUID)",
    "title": "string",
    "description": "string (optional)",
    "price": "number",
    "rating": "number",
    "ratingCount": "number",
    "createdAt": "date",
    "updatedAt": "date",
    "categories": [
      {
        "id": "string (UUID)",
        "name": "string"
      }
    ],
    "authors": [
      {
        "id": "string (UUID)",
        "name": "string"
      }
    ]
  }
  ```

### Hybrid Search Products
- **Method**: `GET`
- **Endpoint**: `/products/hybrid-search`
- **Description**: Search products using hybrid search
- **Authentication**: Public (no token required)
- **Status Code**: 200 OK

#### Request
- **Query Parameters**: HybridSearchQueryDto
  ```json
  {
    "query": "string (required)",
    "limit": "number (optional)"
  }
  ```

#### Response
- **Success Response**: 200 OK
  ```json
  [
    {
      "id": "string (UUID)",
      "title": "string",
      "description": "string (optional)",
      "price": "number",
      "rating": "number",
      "ratingCount": "number",
      "createdAt": "date",
      "updatedAt": "date",
      "categories": [
        {
          "id": "string (UUID)",
          "name": "string"
        }
      ],
      "authors": [
        {
          "id": "string (UUID)",
          "name": "string"
        }
      ]
    }
  ]
  ```

### Create Product
- **Method**: `POST`
- **Endpoint**: `/products`
- **Description**: Create a new product (Admin only)
- **Authentication**: JWT Bearer Token (Admin role required)
- **Status Code**: 201 Created

#### Request
- **Body**: CreateProductDto
  ```json
  {
    "title": "string (required)",
    "description": "string (optional)",
    "descriptionSummary": "string (optional)",
    "price": "number (required, minimum 0)",
    "categoryIds": "array of strings (UUIDs, optional)",
    "authorIds": "array of strings (UUIDs, optional)"
  }
  ```

#### Response
- **Success Response**: 201 Created
  ```json
  {
    "id": "string (UUID)",
    "title": "string",
    "description": "string (optional)",
    "price": "number",
    "rating": "number",
    "ratingCount": "number",
    "createdAt": "date",
    "updatedAt": "date",
    "categories": [
      {
        "id": "string (UUID)",
        "name": "string"
      }
    ],
    "authors": [
      {
        "id": "string (UUID)",
        "name": "string"
      }
    ]
  }
  ```

### Delete Product
- **Method**: `DELETE`
- **Endpoint**: `/products/:id`
- **Description**: Delete a product by ID (Admin only)
- **Authentication**: JWT Bearer Token (Admin role required)
- **Status Code**: 200 OK

#### Response
- **Success Response**: 200 OK (No Content)

## User API

Base URL: `/users`

### Get All Users (Admin Only)
- **Method**: `GET`
- **Endpoint**: `/users`
- **Description**: Retrieve all users with pagination (Admin only)
- **Authentication**: JWT Bearer Token (Admin role required)
- **Status Code**: 200 OK

#### Request
- **Query Parameters**:
  - `page`: number (optional, default: 1)
  - `limit`: number (optional, default: 10)
  - `search`: string (optional) - Search by full name

#### Response
- **Success Response**: 200 OK
  ```json
  {
    "data": [
      {
        "id": "string (UUID)",
        "fullName": "string",
        "email": "string",
        "phoneNumber": "string (optional)",
        "role": "Role enum",
        "createdAt": "date",
        "updatedAt": "date"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number",
    "totalPages": "number"
  }
  ```

### Get User by ID (Admin Only)
- **Method**: `GET`
- **Endpoint**: `/users/:id`
- **Description**: Retrieve a specific user by ID (Admin only)
- **Authentication**: JWT Bearer Token (Admin role required)
- **Status Code**: 200 OK

#### Response
- **Success Response**: 200 OK
  ```json
  {
    "id": "string (UUID)",
    "fullName": "string",
    "email": "string",
    "phoneNumber": "string (optional)",
    "role": "Role enum",
    "createdAt": "date",
    "updatedAt": "date"
  }
  ```

## Common DTOs

### PaginationQueryDto
```json
{
  "page": "number (optional, default: 1)",
  "limit": "number (optional, default: 10)"
}
```

### BaseResponseDto
All response DTOs extend this base class:
```json
{
  // Common fields (implementation-specific)
}
```

## Security Notes

- Public endpoints (no authentication required) are marked with `@Public()` decorator
- JWT Bearer Token authentication is required for most endpoints
- Admin endpoints require the `@Roles(Role.ADMIN)` decorator and require an admin user token
- User endpoints require a valid user token but not necessarily admin privileges

## Common Error Responses

- 401: Unauthorized (Invalid or missing JWT token)
- 403: Forbidden (Insufficient permissions for the requested operation)
- 404: Not Found (Requested resource does not exist)
- 400: Bad Request (Invalid request parameters or body)
- 500: Internal Server Error (Unexpected server error)