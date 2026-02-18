# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "jwt_token"
}
```

### Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "jwt_token"
}
```

### Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "addresses": [],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Update Profile
**PUT** `/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "password": "newpassword123"
}
```

---

## Product Endpoints

### Get All Products
**GET** `/products?page=1&keyword=laptop&category=Electronics`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `keyword` (optional): Search keyword
- `category` (optional): Filter by category

**Response:**
```json
{
  "products": [...],
  "page": 1,
  "pages": 5,
  "total": 50
}
```

### Get Featured Products
**GET** `/products/featured`

**Response:**
```json
[
  {
    "_id": "product_id",
    "name": "Wireless Headphones",
    "description": "Premium headphones...",
    "price": 299.99,
    "category": "Electronics",
    "brand": "AudioTech",
    "stock": 50,
    "images": ["url"],
    "rating": 4.5,
    "numReviews": 12,
    "featured": true
  }
]
```

### Get Single Product
**GET** `/products/:id`

**Response:**
```json
{
  "_id": "product_id",
  "name": "Product Name",
  "description": "Description",
  "price": 99.99,
  "category": "Electronics",
  "brand": "Brand Name",
  "stock": 100,
  "images": ["url1", "url2"],
  "rating": 4.5,
  "numReviews": 25,
  "reviews": [
    {
      "user": "user_id",
      "name": "John Doe",
      "rating": 5,
      "comment": "Great product!",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "featured": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Create Product (Admin Only)
**POST** `/products`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 199.99,
  "category": "Electronics",
  "brand": "Brand Name",
  "stock": 50,
  "images": ["url1", "url2"],
  "featured": true
}
```

### Update Product (Admin Only)
**PUT** `/products/:id`

**Headers:** `Authorization: Bearer <admin_token>`

### Delete Product (Admin Only)
**DELETE** `/products/:id`

**Headers:** `Authorization: Bearer <admin_token>`

### Add Product Review
**POST** `/products/:id/reviews`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent product!"
}
```

---

## Cart Endpoints

### Get User Cart
**GET** `/cart`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "cart_id",
  "user": "user_id",
  "items": [
    {
      "_id": "item_id",
      "product": {
        "_id": "product_id",
        "name": "Product Name",
        "price": 99.99,
        "images": ["url"]
      },
      "quantity": 2
    }
  ],
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Add Item to Cart
**POST** `/cart/add`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 1
}
```

### Update Cart Item Quantity
**PUT** `/cart/update/:itemId`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "quantity": 3
}
```

### Remove Item from Cart
**DELETE** `/cart/remove/:itemId`

**Headers:** `Authorization: Bearer <token>`

### Clear Cart
**DELETE** `/cart/clear`

**Headers:** `Authorization: Bearer <token>`

---

## Order Endpoints

### Create Order
**POST** `/orders`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "orderItems": [
    {
      "product": "product_id",
      "name": "Product Name",
      "quantity": 2,
      "price": 99.99,
      "image": "url"
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "card",
  "itemsPrice": 199.98,
  "taxPrice": 19.98,
  "shippingPrice": 10.00,
  "totalPrice": 229.96
}
```

**Response:**
```json
{
  "_id": "order_id",
  "user": "user_id",
  "orderItems": [...],
  "shippingAddress": {...},
  "paymentMethod": "card",
  "itemsPrice": 199.98,
  "taxPrice": 19.98,
  "shippingPrice": 10.00,
  "totalPrice": 229.96,
  "isPaid": false,
  "isDelivered": false,
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Get Order by ID
**GET** `/orders/:id`

**Headers:** `Authorization: Bearer <token>`

### Get My Orders
**GET** `/orders/user/myorders`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "order_id",
    "orderItems": [...],
    "totalPrice": 229.96,
    "isPaid": true,
    "paidAt": "2024-01-01T00:00:00.000Z",
    "isDelivered": false,
    "status": "processing",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get All Orders (Admin Only)
**GET** `/orders`

**Headers:** `Authorization: Bearer <admin_token>`

### Update Order to Paid
**PUT** `/orders/:id/pay`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "payment_id",
  "status": "completed",
  "update_time": "2024-01-01T00:00:00.000Z",
  "email_address": "payer@example.com"
}
```

### Update Order to Delivered (Admin Only)
**PUT** `/orders/:id/deliver`

**Headers:** `Authorization: Bearer <admin_token>`

### Update Order Status (Admin Only)
**PUT** `/orders/:id/status`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "status": "shipped"
}
```

### Cancel Order
**DELETE** `/orders/:id`

**Headers:** `Authorization: Bearer <token>`

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized as admin"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error",
  "error": "Error details (development only)"
}
```

---

## Status Codes

- `200 OK` - Successful GET request
- `201 Created` - Successful POST request
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error
