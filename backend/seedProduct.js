const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const sampleProducts = [
  {
    name: "Monstera Deliciosa",
    description: "Beautiful Swiss Cheese plant with large, glossy leaves with natural holes. Perfect for bright, indirect light areas. Adds tropical vibes to any room.",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop",
    category: "Indoor Plants",
    inStock: true,
    featured: true
  },
  {
    name: "Snake Plant",
    description: "Extremely hardy and low maintenance. Purifies air and thrives in low light conditions. Perfect for beginners and busy plant parents.",
    price: 32.99,
    image: "https://images.unsplash.com/photo-1593482892290-9d0131035e0b?w=400&h=400&fit=crop",
    category: "Indoor Plants",
    inStock: true,
    featured: true
  },
  {
    name: "Fiddle Leaf Fig",
    description: "Trendy tree with large, violin-shaped leaves. Loves bright, indirect light and consistent watering. Makes a stunning statement piece.",
    price: 68.99,
    image: "https://images.unsplash.com/photo-1593483316242-2c6f433e3edf?w=400&h=400&fit=crop",
    category: "Indoor Plants",
    inStock: true,
    featured: false
  },
  {
    name: "Pothos Golden",
    description: "Easy-care trailing plant with heart-shaped variegated leaves. Great for shelves and hanging baskets. Very forgiving for beginners.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1596464716127-f2a5dcee6292?w=400&h=400&fit=crop",
    category: "Indoor Plants",
    inStock: true,
    featured: true
  },
  {
    name: "Echeveria Succulent",
    description: "Beautiful rosette-shaped succulent with pink edges. Low water needs and loves bright light. Perfect for sunny windowsills.",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&h=400&fit=crop",
    category: "Succulents",
    inStock: true,
    featured: false
  },
  {
    name: "String of Pearls",
    description: "Unique trailing succulent with bead-like leaves. Perfect for hanging planters. Adds whimsical charm to any space.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1593693394760-60d41b27a1af?w=400&h=400&fit=crop",
    category: "Succulents",
    inStock: true,
    featured: true
  },
  {
    name: "Ceramic Planter - White",
    description: "Modern white ceramic planter with drainage hole. 6-inch diameter, perfect for most houseplants. Minimalist and elegant design.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    category: "Planters",
    inStock: true,
    featured: false
  },
  {
    name: "Macrame Hanger",
    description: "Handmade macrame plant hanger. 3ft length, perfect for displaying trailing plants. Bohemian style for your plant display.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1598880940080-ff9a298db876?w=400&h=400&fit=crop",
    category: "Planters",
    inStock: true,
    featured: true
  },
  {
    name: "Plant Care Starter Kit",
    description: "Everything you need: watering can, mister, pruning shears, and plant food. Perfect for beginners starting their plant journey.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1485841938031-1bf81239b815?w=400&h=400&fit=crop",
    category: "Care Kits",
    inStock: true,
    featured: false
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    await Product.insertMany(sampleProducts);
    console.log('Added 9 sample products successfully!');

    // Display the added products
    const products = await Product.find();
    console.log('\n📦 Added Products:');
    products.forEach(product => {
      console.log(`🌿 ${product.name} - $${product.price} - ${product.category}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Run the seed function
seedProducts();