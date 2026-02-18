# Full-Stack E-Commerce Application

A complete, production-ready e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Features

### User Features
- **User Authentication**: JWT-based authentication with secure password hashing
- **Product Browsing**: Search, filter, and pagination for products
- **Shopping Cart**: Add/remove items, update quantities, persistent cart storage
- **Product Reviews**: Rate and review products
- **Order Management**: Place orders, track status, view order history
- **User Profile**: Update profile information and manage addresses
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Product Management**: Create, update, delete products
- **Order Management**: View all orders, update order status
- **User Management**: View user information
- **Dashboard**: Overview of sales and statistics

### Technical Features
- RESTful API architecture
- JWT authentication
- MongoDB database with Mongoose ODM
- Input validation and sanitization
- Error handling middleware
- CORS enabled
- Secure password hashing with bcrypt
- State management with Zustand
- React Router for navigation
- Toast notifications
- Responsive CSS with modern design

## 📋 Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecommerce-fullstack
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (already provided) and update if needed
# Edit .env file with your configurations:
# - MongoDB connection string
# - JWT secret
# - Port number
# - Stripe API keys (optional)

# Start MongoDB (if not running)
# On macOS/Linux:
mongod

# On Windows:
# "C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe"
```

### 3. Seed Database with Sample Data

```bash
# Still in backend directory
node seed.js
```

This will create:
- Sample products (12 electronics items)
- Admin user (email: admin@ecommerce.com, password: admin123)
- Regular user (email: john@example.com, password: password123)

### 4. Start Backend Server

```bash
# In backend directory
npm start

# For development with auto-reload
npm run dev
```

Backend will run on http://localhost:5000

### 5. Frontend Setup

```bash
# Open new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on http://localhost:3000

## 🗂️ Project Structure

```
ecommerce-fullstack/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── middleware/
│   │   └── auth.js                # Authentication middleware
│   ├── models/
│   │   ├── User.js                # User model
│   │   ├── Product.js             # Product model
│   │   ├── Order.js               # Order model
│   │   └── Cart.js                # Cart model
│   ├── routes/
│   │   ├── auth.js                # Authentication routes
│   │   ├── products.js            # Product routes
│   │   ├── cart.js                # Cart routes
│   │   └── orders.js              # Order routes
│   ├── .env                       # Environment variables
│   ├── server.js                  # Express server
│   ├── seed.js                    # Database seeder
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Header.js          # Navigation header
    │   │   ├── Header.css
    │   │   ├── ProductCard.js     # Product card component
    │   │   └── ProductCard.css
    │   ├── pages/
    │   │   ├── Home.js            # Home page
    │   │   ├── Home.css
    │   │   ├── Login.js           # Login page
    │   │   └── Auth.css
    │   ├── services/
    │   │   └── api.js             # Axios configuration
    │   ├── store/
    │   │   └── index.js           # Zustand state management
    │   ├── styles/
    │   │   └── index.css          # Global styles
    │   ├── App.js                 # Main app component
    │   └── index.js               # Entry point
    └── package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Products
- `GET /api/products` - Get all products (with pagination & filters)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add review (Protected)

### Cart
- `GET /api/cart` - Get user cart (Protected)
- `POST /api/cart/add` - Add item to cart (Protected)
- `PUT /api/cart/update/:itemId` - Update cart item (Protected)
- `DELETE /api/cart/remove/:itemId` - Remove from cart (Protected)
- `DELETE /api/cart/clear` - Clear cart (Protected)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders/:id` - Get order by ID (Protected)
- `GET /api/orders/user/myorders` - Get user orders (Protected)
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/pay` - Update to paid (Protected)
- `PUT /api/orders/:id/deliver` - Update to delivered (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `DELETE /api/orders/:id` - Cancel order (Protected)

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in localStorage and included in API requests via Authorization header.

```javascript
Authorization: Bearer <token>
```

## 💳 Payment Integration

The project includes Stripe payment integration setup. To enable:

1. Sign up for Stripe account
2. Get your API keys
3. Add to `.env` file:
```
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## 🧪 Testing

### Test User Credentials

**Admin Account:**
- Email: admin@ecommerce.com
- Password: admin123

**Regular User:**
- Email: john@example.com
- Password: password123

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway)

1. Set environment variables in your hosting platform
2. Ensure MongoDB is accessible (MongoDB Atlas recommended)
3. Deploy backend code

### Frontend Deployment (e.g., Vercel, Netlify)

1. Update API URL in `.env`:
```
REACT_APP_API_URL=https://your-backend-url.com/api
```
2. Build the project:
```bash
npm run build
```
3. Deploy the `build` folder

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=http://localhost:3000
```

### Frontend
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🛡️ Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT authentication with expiration
- Protected routes and API endpoints
- Input validation and sanitization
- CORS configuration
- MongoDB injection prevention
- XSS protection

## 🎨 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **express-validator** - Input validation
- **Stripe** - Payment processing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## 📚 Additional Features to Implement

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Wishlist feature
- [ ] Product comparison
- [ ] Advanced filtering and sorting
- [ ] Order tracking with status updates
- [ ] Product recommendations
- [ ] Discount codes and coupons
- [ ] Admin dashboard with analytics
- [ ] Image upload for products
- [ ] Multiple payment methods
- [ ] Social media login
- [ ] Product categories and subcategories
- [ ] Inventory management

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in .env file
- Verify MongoDB port (default: 27017)

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### CORS Errors
- Ensure FRONTEND_URL in backend .env matches frontend URL
- Check CORS configuration in server.js

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@techstore.com or open an issue in the repository.

---

**Happy Coding! 🚀**
