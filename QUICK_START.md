# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (in a new terminal)
cd frontend
npm install
```

### Step 2: Start MongoDB

Make sure MongoDB is running on your system:

```bash
# macOS/Linux
mongod

# Windows
"C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe"
```

### Step 3: Seed the Database

```bash
# In backend directory
node seed.js
```

This creates sample products and test users.

### Step 4: Start the Servers

```bash
# Terminal 1 - Start Backend (in backend directory)
npm start

# Terminal 2 - Start Frontend (in frontend directory)
npm start
```

### Step 5: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

### Step 6: Login

Use these credentials to test:

**Admin Account:**
- Email: admin@ecommerce.com
- Password: admin123

**Regular User:**
- Email: john@example.com  
- Password: password123

## 🎯 What You Get

✅ Complete authentication system
✅ Product catalog with 12 sample electronics
✅ Shopping cart functionality
✅ Order management
✅ User profiles
✅ Admin panel
✅ Responsive design
✅ REST API with full CRUD operations

## 📝 Next Steps

1. Explore the products page
2. Add items to cart
3. Place an order
4. Check your order history
5. Try the admin features (with admin account)

## 🛠️ Development Tips

- Backend runs on port 5000
- Frontend runs on port 3000
- MongoDB default port is 27017
- Check API endpoints in `API_DOCUMENTATION.md`
- See full features in `README.md`

## ⚡ Troubleshooting

**Port in use?**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**MongoDB not connecting?**
- Ensure MongoDB is running
- Check connection string in `backend/.env`

**Frontend can't reach backend?**
- Verify backend is running on port 5000
- Check CORS settings in `backend/server.js`

## 📚 Learn More

- Full documentation: `README.md`
- API reference: `API_DOCUMENTATION.md`
- Project structure: See directory tree below

```
ecommerce-fullstack/
├── backend/                 # Node.js + Express API
│   ├── config/             # Database configuration
│   ├── middleware/         # Auth middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── server.js           # Express server
│   └── seed.js             # Database seeder
│
└── frontend/               # React application
    ├── public/             # Static files
    └── src/
        ├── components/     # Reusable components
        ├── pages/          # Page components
        ├── services/       # API service
        ├── store/          # State management
        └── styles/         # Global styles
```

Happy coding! 🎉
