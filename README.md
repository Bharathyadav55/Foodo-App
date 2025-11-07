# 🍕 Foodoo - Food Delivery Platform

> A modern, full-stack food delivery application with seamless ordering, real-time restaurant discovery, and secure authentication.

![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=flat-square&logo=node.js)
![React](https://img.shields.io/badge/React-18.x-blue?style=flat-square&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat-square&logo=mongodb)
![Vite](https://img.shields.io/badge/Vite-5.x-purple?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 🌟 Live Demo

- **Frontend**: https://foodo-frontend.onrender.com
- **Backend API**: https://foodo-app-backend.onrender.com
- **GitHub Repo**: https://github.com/Bharathyadav55/Foodo-App

---

## ✨ Key Features

### 🔐 **Dual Authentication**
- Google OAuth 2.0 integration with Passport.js
- Email/password signup & login with JWT tokens
- 7-day session management with secure token expiration
- Password hashing with bcryptjs

### 🍽️ **Smart Restaurant Discovery**
- Browse 15+ restaurants with dynamic filtering
- Filter by 8+ cuisine types (Biryani, Pizza, Dosa, etc.)
- Toggle between Dining Out & Delivery modes
- Real-time restaurant availability

### 🛒 **Seamless Cart Management**
- Add/remove items with quantity controls
- Login-required checkout flow
- Automatic cart persistence
- Real-time pricing calculation

### 📦 **Complete Order System**
- Multi-step checkout (cart → details → payment)
- 4 payment methods (UPI, Card, Net Banking, COD)
- Order confirmation with details
- Address & contact validation

### 💳 **Secure Payments**
- Multiple payment gateway support
- Order total calculation with taxes & delivery
- Payment method selection
- Order history tracking

---

## 🛠️ Tech Stack

### **Frontend**

React.js 18.x - UI Library
Vite 5.x - Build Tool & Dev Server
Tailwind CSS - Styling
Framer Motion - Animations & Transitions
React Router - Client-side Routing


### **Backend**

Node.js 20.x - Runtime
Express.js 5.x - Web Framework
MongoDB - Database
Mongoose 8.x - ODM
Passport.js - Authentication Middleware
JWT - Token Management
bcryptjs - Password Hashing


### **Infrastructure**

MongoDB Atlas - Cloud Database
Render - Deployment Platform
Google Cloud Console - OAuth Provider
GitHub - Version Control


---

## 📁 Project Structure

Foodoo/
├── foodoo-frontend/ # React + Vite App
│ ├── src/
│ │ ├── pages/
│ │ │ └── Home.jsx # Main landing page
│ │ ├── components/
│ │ │ ├── Navbar.jsx # Navigation & user menu
│ │ │ ├── Hero.jsx # Hero section
│ │ │ ├── RestaurantCard.jsx # Restaurant card component
│ │ │ ├── CartModal.jsx # Shopping cart modal
│ │ │ ├── LoginModal.jsx # Login form
│ │ │ ├── SignupModal.jsx # Signup form
│ │ │ ├── RestaurantDetailsModal.jsx
│ │ │ ├── TableBookingModal.jsx
│ │ │ └── allRestaurants.jsx # Restaurant data
│ │ └── assets/ # Images & icons
│ ├── vite.config.js
│ └── package.json
│
├── foodoo-backend/ # Node.js + Express API
│ ├── config/
│ │ └── passport.js # Passport strategy setup
│ ├── models/
│ │ ├── User.js # User schema
│ │ └── Order.js # Order schema
│ ├── routes/
│ │ ├── auth.js # Auth endpoints (signup, login, OAuth)
│ │ ├── orders.js # Order endpoints
│ │ └── users.js # User profile endpoints
│ ├── index.js # Server entry point
│ ├── .env # Environment variables
│ └── package.json
│
├── README.md # Project documentation
└── .gitignore # Git ignore rules


---

## 🚀 Getting Started

### **Prerequisites**
- Node.js v18+ & npm
- MongoDB Atlas Account
- Google OAuth Credentials

### **1. Clone Repository**
git clone https://github.com/Bharathyadav55/Foodo-App.git
cd Foodo-App

### **2. Setup Backend**
cd foodoo-backend
npm install


Create `.env` file:
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/foodoo
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development


Start backend:
npm start
Server runs on http://localhost:5000


### **3. Setup Frontend**
cd ../Foodoo
npm install
npm run dev

Frontend runs on http://localhost:5173


---

## 📡 API Endpoints

### **Authentication**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/google` | Trigger Google OAuth |
| GET | `/api/auth/google/callback` | OAuth callback |
| POST | `/api/auth/signup` | Email/password signup |
| POST | `/api/auth/login` | Email/password login |

### **Orders**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders` | Get user orders |
| GET | `/api/orders/:id` | Get order details |

### **Users**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get user profile |
| PUT | `/api/user/profile` | Update profile |

---

## 🔐 Security Features

✅ JWT token-based authentication
✅ Secure password hashing with bcryptjs
✅ Google OAuth 2.0 integration
✅ CORS protection
✅ Environment variable encryption
✅ SQL injection prevention with Mongoose
✅ XSS protection

---

## 🚢 Deployment

### **Frontend (Render Static Site)**
npm run build

Deploy dist/ folder to Render


### **Backend (Render Web Service)**
Automatically deploys from GitHub
Set environment variables in Render dashboard


---

## 🎯 Usage Guide

### **For Users**
1. **Sign Up** - Create account via email or Google
2. **Browse** - Explore restaurants & filter by cuisine
3. **Order** - Add items to cart & checkout
4. **Pay** - Choose payment method & confirm
5. **Track** - View order history & status

### **For Developers**
Development
npm run dev

Build for production
npm run build

Preview production build
npm run preview


---

## 🗺️ Future Enhancements

- 🗺️ Real-time delivery tracking with Google Maps
- ⭐ Restaurant ratings & user reviews system
- 💬 Live chat support between users & restaurants
- 🔔 Push notifications for order updates
- 📊 Analytics dashboard for restaurants
- 🚗 Delivery partner mobile app
- 📈 Advanced search & recommendations

---

## 🐛 Known Issues & Fixes

| Issue | Solution |
|-------|----------|
| Google OAuth error 400 | Update authorized redirect URIs in Google Console |
| MongoDB connection timeout | Whitelist IP in MongoDB Atlas Network Access |
| CORS errors | Verify FRONTEND_URL in backend .env |

---

## 📊 Performance Metrics

- ⚡ **Frontend Load Time**: ~2.5s
- 🚀 **API Response Time**: <500ms
- 📦 **Bundle Size**: ~180KB (gzipped)
- 🔄 **Cold Start**: ~45s (Render free tier)

---

## 📝 Environment Variables

### **Frontend (.env)**
VITE_API_URL=https://foodo-app-backend.onrender.com

### **Backend (.env)**
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
SESSION_SECRET=your_secret
FRONTEND_URL=https://foodo-frontend.onrender.com
PORT=5000
NODE_ENV=production


---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📧 Support & Contact

- **Email**: bharathyadav650@gmail.com
- **GitHub**: [@Bharathyadav55](https://github.com/Bharathyadav55)
- **Portfolio**: [Your Portfolio URL]

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎓 Learning Resources Used

- [React Documentation](https://react.dev)
- [Node.js & Express Guide](https://nodejs.org)
- [MongoDB University](https://university.mongodb.com)
- [Passport.js Auth Strategy](http://www.passportjs.org)
- [Tailwind CSS Docs](https://tailwindcss.com)

---

## ⭐ Star History

If you find this project helpful, please consider giving it a star! ⭐

---

**Made with ❤️ for food lovers everywhere**

🍕 Discover. Order. Enjoy. 🍕
