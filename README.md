# LUXORA - "Wear Your Confidence" 🛍️

LUXORA is a complete, modern, responsive, and professional **Online Fashion Shopping Website** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). 

This project features a premium, fashion-editorial aesthetic, robust RESTful APIs, dynamic filtering, and a fully functional shopping cart.

## 🚀 Tech Stack

- **Frontend:** React.js, Vite, React Router DOM, Axios, Context API, Vanilla CSS.
- **Backend:** Node.js, Express.js, JWT Authentication, BcryptJS.
- **Database:** MongoDB & Mongoose.

## ✨ Features

- **Premium UI/UX:** Responsive, component-based design with smooth animations and a minimalist fashion-focused aesthetic.
- **Product Catalog:** Extensive product browsing with advanced filtering (by Category, Brand, Size, Price) and sorting options.
- **Dynamic Shopping Cart:** Add to cart, remove items, update quantities, and view dynamic subtotal/tax calculations.
- **User Authentication:** Secure Login and Registration using JWT (JSON Web Tokens) and password hashing.
- **Product Details:** Dedicated product pages featuring image galleries, size selectors, and customer reviews.
- **Database Seeding:** Pre-configured script to instantly populate the database with realistic fashion products.

## 📂 Project Structure

```text
LUXORA/
├── backend/            # Express.js REST API
│   ├── config/         # Database connection logic
│   ├── controllers/    # API endpoint logic (Auth, Products, Cart)
│   ├── middleware/     # JWT protection & Error handling
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # Express routers
│   ├── seed/           # Database seeding script
│   └── server.js       # Entry point
│
└── frontend/           # React SPA
    ├── public/         
    └── src/
        ├── components/ # Reusable UI (Navbar, Footer, ProductCard, Carousel)
        ├── context/    # React Context (AuthContext, CartContext)
        ├── pages/      # Route pages (Home, Products, Cart, Login, etc.)
        └── index.css   # Global premium styling
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB server)

### 1. Clone the Repository
```bash
git clone https://github.com/Ashu16nov/LUXORA-E-Commerce-Website.git
cd LUXORA-E-Commerce-Website
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

**Seed the Database:**
To populate your database with sample products and the default test user (`test@gmail.com` / `test@123`), run:
```bash
node seed/seedData.js
```

**Start the Server:**
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The React app will typically be running at `http://localhost:5173`.

## 🔐 Default Test Credentials
If you seeded the database using the provided script, you can log in immediately with:
- **Email:** `test@gmail.com`
- **Password:** `test@123`

## 📄 License
This project was created for an academic MERN stack evaluation. All fashion imagery used belongs to their respective owners on Unsplash.
