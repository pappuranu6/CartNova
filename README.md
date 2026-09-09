# 🛒 CartNova

CartNova is a full-stack MERN e-commerce application built with MongoDB, Express.js, React.js, and Node.js.

## ✨ Features

### 👤 Customer Features

- User Registration & Login
- Forgot Password with OTP Verification
- Product Search
- Product Category Filtering
- Product Details
- Product Reviews & Ratings
- Shopping Cart
- Product Quantity Management
- Shipping Address
- Razorpay Payment Integration
- Order Placement
- My Orders
- User Profile
- Recent Order History

### 🔐 Admin Features

- Admin Login
- Admin Dashboard
- Product Management
- Create Product
- Edit Product
- Delete Product
- User Management
- Edit User
- Delete User
- Order Management
- Order Details
- Mark Orders as Delivered
- Sales & Order Statistics

## 💳 Payment

CartNova uses **Razorpay** for online payment processing.

> Payment credentials and secret keys must never be committed to GitHub.

## 🛠️ Tech Stack

### Frontend

- React.js
- Redux
- React Router
- React Bootstrap
- Axios
- Recharts

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Multer

### Payment

- Razorpay

## 📁 Project Structure

```text
CartNova/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│
├── uploads/
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md