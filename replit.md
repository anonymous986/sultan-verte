# Sultan Verite Fashion E-Commerce Website

## Overview
This is a static fashion e-commerce website for Sultan Verite, featuring a modern design with product catalog, shopping cart functionality, and admin panel for product management.

## Project Type
- **Type**: Static HTML/CSS/JavaScript Website
- **Framework**: Vanilla JavaScript (no framework dependencies)
- **Server**: Python HTTP Server (port 5000)

## Features
- **User Authentication**: Login and signup system with localStorage-based session management
- **Product Catalog**: Browse new arrivals, favorites, and best-selling items
- **Product Details**: Click any product card to view detailed information
- **Shopping Cart**: Add products to cart with local storage persistence and quantity selection
- **Admin Panel**: Add custom products via admin.html
- **Responsive Design**: Fully mobile-optimized with 2-column grid and smaller sections
- **Animation Effects**: ScrollReveal animations for smooth page transitions
- **Interactive Cards**: Hover effects on product cards with clickable navigation

## File Structure
```
├── index.html             # Main landing page
├── login.html             # Login page
├── signup.html            # Signup page
├── products.html          # Products catalog page
├── product-details.html   # Product details page
├── cart.html             # Shopping cart page
├── admin.html            # Admin panel for managing products
├── style.css             # Main stylesheet with responsive design
├── auth.css              # Login/signup page styles
├── product-details.css   # Product details page styles
├── admin.css             # Admin panel styles
├── cart.css              # Cart page styles
├── app.js                # Main navigation and animations
├── products.js           # Product data and cart functionality
├── auth.js               # Authentication and user management
├── product-details.js    # Product details page functionality
├── admin.js              # Admin panel functionality
├── cart.js               # Cart page functionality
├── server.py             # Python HTTP server
└── assets/               # Images and media files
```

## Technology Stack
- HTML5
- CSS3 (Custom styling with CSS variables)
- Vanilla JavaScript
- LocalStorage for data persistence
- ScrollReveal.js for animations
- Remixicon for icons

## Data Storage
- Products and cart data are stored in browser's localStorage
- Default products are defined in products.js
- Custom products can be added through the admin panel

## Development
The site runs on a Python HTTP server configured to:
- Serve static files from the root directory
- Bind to 0.0.0.0:5000 for Replit compatibility
- Disable caching to ensure fresh content delivery

## Pages
1. **index.html**: Home page with featured products and sections
2. **login.html**: User login page
3. **signup.html**: User registration page
4. **products.html**: Complete product catalog
5. **product-details.html**: Detailed product view with quantity selection
6. **cart.html**: Shopping cart with checkout functionality
7. **admin.html**: Product management interface

## Recent Changes
- **2025-10-31**: Authentication system and mobile responsiveness
  - Created login and signup pages with localStorage-based authentication
  - Added dynamic navbar that shows login/signup or user menu based on auth status
  - Implemented user dropdown menu with profile, orders, settings, and logout options
  - Made website fully responsive for mobile devices:
    - Hidden header image on mobile for better performance
    - 2-column grid layout for product cards on mobile
    - Smaller best selling section on mobile
    - Optimized navigation and footer for mobile
    - Responsive forms and buttons

- **2025-10-31**: Product details page and cart quantity fix
  - Fixed cart quantity issue by implementing event delegation (prevents duplicate listeners)
  - Created product details page with full product information display
  - Added click navigation from all product cards to details page
  - Implemented quantity selector with validation
  - Added hover effects to product cards
  - Enhanced addToCart with quantity parameter and input sanitization
  
- **2025-10-31**: Initial project setup in Replit environment
  - Moved files from subdirectory to root
  - Created Python HTTP server with cache control headers and socket reuse
  - Configured workflow for port 5000
  - Added .gitignore for Python projects
  - Fixed missing background image reference in CSS
