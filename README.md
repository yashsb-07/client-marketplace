# Client Marketplace

A full-stack marketplace web application built as a client demonstration project.

The application provides complete Buyer, Seller, and Admin workflows, including marketplace browsing, product management, cart and checkout flows, order creation, and a simulated payment experience.

## Live Demo

Frontend:

https://client-marketplace-five.vercel.app/

Backend API:

https://client-marketplace-api.onrender.com

## Overview

Client Marketplace is a role-based marketplace application designed to demonstrate a complete end-to-end shopping and marketplace management workflow.

The application supports three primary user roles:

- Buyer
- Seller
- Admin

The project is split into a React/Vite frontend and a Node.js/Express backend with PostgreSQL persistence through Prisma.

## Features

- Role-based authentication and authorization
- Buyer, Seller, and Admin workflows
- Marketplace product browsing
- Product search
- Category filtering
- Minimum and maximum price filtering
- Availability filtering
- Product sorting
- Pagination
- Product details
- Shopping cart management
- Cart quantity updates
- Remove and clear cart items
- Checkout workflow
- Order creation
- Simulated demo payment flow
- Successful, failed, and cancelled payment outcomes
- Seller product management
- Product visibility controls
- Product activation/deactivation
- Admin user management
- Admin product management
- Admin order management
- Admin payment management
- Role-aware application navigation
- Protected routes
- Intended-destination redirect after login
- Responsive navigation and layouts
- Client demo welcome page

## User Roles

### Buyer

A Buyer can:

- Register and log in
- Browse marketplace products
- Search products
- Filter products by category
- Filter by minimum and maximum price
- Filter by availability
- Sort products
- Navigate through paginated product results
- View product details
- Add products to the cart
- Update cart quantities
- Remove cart items
- Clear the cart
- Continue shopping
- Proceed to checkout
- Create an order
- Complete a simulated payment
- View successful, failed, and cancelled payment results

### Seller

A Seller can:

- Log in through the role-based authentication flow
- Access the Seller Dashboard
- View managed products
- Create products
- Edit products
- Manage product visibility
- Hide and show products
- Activate and deactivate products
- Navigate between the Seller Dashboard, My Products, and Marketplace

### Admin

An Admin can:

- Log in through the role-based authentication flow
- Access the Admin Dashboard
- View marketplace dashboard information
- Manage sellers and buyers
- Block and unblock users
- Manage products
- View product visibility and status information
- Review orders
- Review payments
- View marketplace revenue/dashboard information

## Application Workflow

### Buyer Journey

```text
Home
  ↓
Marketplace
  ↓
Product Details
  ↓
Add to Cart
  ↓
Cart
  ↓
Checkout
  ↓
Create Order
  ↓
Demo Payment
  ↓
Payment Result
