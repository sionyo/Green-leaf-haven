# GreenLeaf Haven

A beautiful online plant store where you can browse and shop for beautiful indoor plants. Built with modern web technologies.

![Dashboard](.products.PNG)
## What is This?

GreenLeaf Haven is a complete e-commerce website for plant lovers. Customers can browse plants, add them to a cart, and checkout securely. Admins can manage products and track orders.

## What's Inside

### For Customers
- Browse all available plants
- Add plants to your shopping cart
- Checkout as a guest (no account needed)
- Secure payment processing
- Works on phones and computers

### For Store Owners
- Admin dashboard to manage everything
- Add new plants and update existing ones
- Track what's in stock
- View all orders

## How to Get Started

### Backend Setup (The Server)
```bash
cd backend
npm install
cp .env.example .env
# Add your database and Stripe keys to the .env file
npm run dev
