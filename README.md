# 🟣 CHIRAG ACKERMAN — Creator HQ

> A full-stack personal creator portfolio, gaming setup showcase, and affiliate storefront built for CHIRAG ACKERMAN.

🌐 **Live Preview:**  
https://chirag-ackerman.vercel.app

---

## 📖 About The Project

**CHIRAG ACKERMAN Creator HQ** is a full-stack personal website created to bring together my creator portfolio, gaming setup, tech products, affiliate links, and collaboration information in one place.

The website is designed around my identity as a **Gaming, Tech, Coding, and Product Content Creator**.

Instead of using a traditional link-in-bio service, this project provides a completely custom platform where visitors can:

- Explore my gaming and creator setup
- Browse products I personally use
- View products by category
- Visit affiliate and official product links
- Learn more about my creator journey
- Contact me for collaborations
- Explore my complete setup
- Access the website seamlessly on desktop and mobile

The project also includes a protected admin dashboard that allows me to manage the website's product catalog without manually editing the frontend code.

---

## ✨ Features

### 🏠 Creator Homepage

- Premium dark purple gaming/tech aesthetic
- Creator introduction
- Social media links
- Creator statistics
- Featured products
- Product categories
- Personal setup showcase
- About section
- Collaboration section
- Affiliate disclosure

### 🛒 Product & Affiliate Store

Products are dynamically managed through the admin dashboard.

Each product can contain:

- Product name
- Brand
- Category
- Description
- Product image
- Price
- Currency
- Store/platform
- Affiliate URL
- Tags
- Specifications
- Featured status
- Published status
- My Setup visibility

Supported store types include:

- Amazon
- Brand Websites
- Affiliate Stores
- Custom Links

### 🎮 My Setup

A dedicated setup showcase that dynamically displays products from the database.

Setup categories include:

- Gaming Setup
- Mouse
- Keyboard
- Mousepad / Desk Mat
- Headphones
- Lighting
- Laptop Accessories
- Creator Gear
- Setup & Workspace

Products can appear in multiple setup sections using setup tags.

### 🔐 Admin Dashboard

A protected admin dashboard allows website content to be managed without editing the frontend manually.

Admin features include:

- Secure admin login
- Add products
- Edit products
- Delete products
- Publish/unpublish products
- Mark products as featured
- Manage My Setup products
- Assign setup categories
- Upload product images
- Manage affiliate links
- Manage product information

### ☁️ Cloudinary Image Uploads

Product images can be uploaded directly through the admin dashboard.

The upload system uses **Cloudinary** for image storage and delivery, while the resulting image URL is stored with the product in MongoDB.

### 📊 Product Ordering

The website supports custom ordering for:

- Featured products
- My Setup products

This allows the admin to control how products appear throughout the website.

### 📩 Collaboration System

The website includes a collaboration/contact system where brands can submit inquiries.

Collaboration information can be stored in the backend for management.

### 📱 Responsive Design

The website is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

The navigation, product sections, category filters, setup sections, and layouts adapt to different screen sizes.

### 🔎 SEO Foundations

The project includes SEO-focused features such as:

- Page titles
- Meta descriptions
- Open Graph metadata
- Semantic HTML
- Image alt text
- Canonical URLs
- Sitemap
- Robots configuration
- Structured data where appropriate
- Internal linking

### ⚡ Production Deployment

The application is deployed on **Vercel** with a production-ready Express backend.

The production stack uses:

- React
- Express
- MongoDB
- Cloudinary
- Vercel

## 🛠️ Tech Stack

### Frontend

- React
- JavaScript / JSX
- Vite
- Tailwind CSS
- Lucide React
- Motion

### Backend

- Node.js
- Express.js
- TypeScript-based server configuration

### Database

- MongoDB
- Mongoose

### Authentication

- Secure server-side admin authentication
- Password hashing
- HTTP-only session/cookie-based authentication

### Media Storage

- Cloudinary

### Development & Deployment

- Git
- GitHub
- VS Code
- Google AI Studio
- Vercel

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │     React + Vite    │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │       API Layer     │
                    └──────┬────────┬─────┘
                           │        │
                  ┌────────▼───┐ ┌──▼──────────┐
                  │  MongoDB   │ │ Cloudinary  │
                  │  Database  │ │   Images    │
                  └────────────┘ └─────────────┘
                           │
                           ▼
                    ┌─────────────────────┐
                    │       Vercel        │
                    │     Deployment      │
                    └─────────────────────┘
