# Seller Backend API

A RESTful backend API built with **Node.js**, **Express.js**, and **MongoDB** for managing sellers and products. The application supports authentication, product management, image uploads, PDF generation, pagination, search, and sorting.

## Features

### Authentication & Authorization

* Admin Login
* Seller Login
* JWT-based Authentication
* Role-based Access Control

### Seller Management

* Create Seller (Admin Only)
* Seller Profile

### Product Management

* Create Product
* Get Product by ID
* Get Seller Products
* Update Product
* Delete Product

### Product Brands

Each product supports multiple brands with:

* Brand Name
* Brand Description
* Brand Image
* Brand Price

### File Uploads

* Multiple Image Uploads
* Brand-wise Image Updates
* Automatic Image Cleanup on Update/Delete

### Product Listing

* Pagination
* Search
* Sorting

### PDF Generation

Generate product PDF reports containing:

* Product Name
* Product Description
* Brand Details
* Brand Images
* Brand Prices
* Total Price

---

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* Multer
* PDFKit
* express-validator
* dotenv

---

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd seller-backend-api
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the project root:

### Run the Application

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

---

## API Endpoints

### Admin

```http
POST /api/admin/login
POST /api/admin/sellers
```

### Seller

```http
POST /api/sellers/login
GET /api/sellers/profile
```

### Products

```http
POST   /api/products
GET    /api/products
GET    /api/products/:productId
PUT    /api/products/:productId
DELETE /api/products/:productId
GET    /api/products/:productId/pdf
```

---

## Authentication

Protected routes require a JWT token:

```http
Authorization: Bearer <token>
```

---

## Project Structure

```text
src/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── utils/
├── validators/
├── uploads/
└── app.js

server.js
```
