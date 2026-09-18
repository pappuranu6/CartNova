import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Product from './models/productModel.js'

dotenv.config()

const adminUserId = '6aa4df8c24fdc1b4c2c2e493'

const products = [
  // =====================================================
  // ELECTRONICS - SMARTPHONES
  // =====================================================

  {
    user: adminUserId,
    name: 'Samsung Galaxy S25',
    image:
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
    brand: 'Samsung',
    category: 'Electronics',
    description:
      'Samsung Galaxy S25 smartphone with modern design and powerful performance.',
    price: 79999,
    countInStock: 20,
  },

  {
    user: adminUserId,
    name: 'Samsung Galaxy A56 5G',
    image:
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
    brand: 'Samsung',
    category: 'Electronics',
    description:
      'Samsung Galaxy A56 5G smartphone with a large display and reliable performance.',
    price: 41999,
    countInStock: 25,
  },

  {
    user: adminUserId,
    name: 'iPhone 16',
    image:
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
    brand: 'Apple',
    category: 'Electronics',
    description:
      'Apple iPhone 16 with powerful performance and premium design.',
    price: 79900,
    countInStock: 15,
  },

  {
    user: adminUserId,
    name: 'iPhone 16 Pro',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    brand: 'Apple',
    category: 'Electronics',
    description:
      'Apple iPhone 16 Pro with premium build and advanced performance.',
    price: 109900,
    countInStock: 12,
  },

  {
    user: adminUserId,
    name: 'Redmi Note 14',
    image:
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800',
    brand: 'Redmi',
    category: 'Electronics',
    description:
      'Redmi Note 14 smartphone with modern design and reliable performance.',
    price: 17999,
    countInStock: 30,
  },

  {
    user: adminUserId,
    name: 'Redmi Note 14 Pro',
    image:
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800',
    brand: 'Redmi',
    category: 'Electronics',
    description:
      'Redmi Note 14 Pro smartphone designed for everyday performance.',
    price: 24999,
    countInStock: 30,
  },

  {
    user: adminUserId,
    name: 'Realme 14 Pro',
    image:
      'https://images.unsplash.com/photo-1598327106026-d9521da673d5?w=800',
    brand: 'Realme',
    category: 'Electronics',
    description:
      'Realme 14 Pro smartphone with stylish design and strong performance.',
    price: 29999,
    countInStock: 25,
  },

  {
    user: adminUserId,
    name: 'Realme GT 7',
    image:
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800',
    brand: 'Realme',
    category: 'Electronics',
    description:
      'Realme GT 7 smartphone with powerful performance and premium design.',
    price: 42999,
    countInStock: 20,
  },

  {
    user: adminUserId,
    name: 'Vivo V50',
    image:
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
    brand: 'Vivo',
    category: 'Electronics',
    description:
      'Vivo V50 smartphone with premium styling and smooth performance.',
    price: 34999,
    countInStock: 20,
  },

  {
    user: adminUserId,
    name: 'Vivo V40',
    image:
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800',
    brand: 'Vivo',
    category: 'Electronics',
    description:
      'Vivo V40 smartphone with stylish design and excellent everyday performance.',
    price: 34999,
    countInStock: 20,
  },

  {
    user: adminUserId,
    name: 'OPPO Reno13',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    brand: 'Oppo',
    category: 'Electronics',
    description:
      'OPPO Reno13 smartphone with elegant design and everyday performance.',
    price: 37999,
    countInStock: 20,
  },

  {
    user: adminUserId,
    name: 'OPPO Find X8',
    image:
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800',
    brand: 'Oppo',
    category: 'Electronics',
    description:
      'OPPO Find X8 smartphone with premium design and powerful hardware.',
    price: 69999,
    countInStock: 15,
  },

  {
    user: adminUserId,
    name: 'Infinix Note 50',
    image:
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800',
    brand: 'Infinix',
    category: 'Electronics',
    description:
      'Infinix Note 50 smartphone with large display and dependable performance.',
    price: 16999,
    countInStock: 35,
  },

  {
    user: adminUserId,
    name: 'Infinix GT 20 Pro',
    image:
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800',
    brand: 'Infinix',
    category: 'Electronics',
    description:
      'Infinix GT 20 Pro gaming smartphone with powerful performance.',
    price: 24999,
    countInStock: 25,
  },

  {
    user: adminUserId,
    name: 'OnePlus 13',
    image:
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
    brand: 'OnePlus',
    category: 'Electronics',
    description:
      'OnePlus 13 premium smartphone with fast performance and modern design.',
    price: 69999,
    countInStock: 15,
  },

  {
    user: adminUserId,
    name: 'OnePlus Nord 5',
    image:
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800',
    brand: 'OnePlus',
    category: 'Electronics',
    description:
      'OnePlus Nord smartphone with fast performance and modern design.',
    price: 33999,
    countInStock: 20,
  },

  {
    user: adminUserId,
    name: 'Motorola Edge 60',
    image:
      'https://images.unsplash.com/photo-1598327106026-d9521da673d5?w=800',
    brand: 'Motorola',
    category: 'Electronics',
    description:
      'Motorola Edge 60 smartphone with modern features and premium styling.',
    price: 35999,
    countInStock: 20,
  },

  {
    user: adminUserId,
    name: 'Motorola Moto G85',
    image:
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800',
    brand: 'Motorola',
    category: 'Electronics',
    description:
      'Motorola smartphone with stylish design and dependable daily performance.',
    price: 19999,
    countInStock: 25,
  },

  // =====================================================
  // FASHION
  // =====================================================

  {
    user: adminUserId,
    name: 'Men Running T-Shirt',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    brand: 'Nike',
    category: 'Fashion',
    description:
      'Comfortable sports t-shirt for everyday workouts and running.',
    price: 1499,
    countInStock: 40,
  },

  {
    user: adminUserId,
    name: 'Classic Sports Hoodie',
    image:
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800',
    brand: 'Puma',
    category: 'Fashion',
    description:
      'Casual sports hoodie suitable for everyday wear.',
    price: 2499,
    countInStock: 30,
  },

  {
    user: adminUserId,
    name: 'Regular Fit Jeans',
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
    brand: "Levi's",
    category: 'Fashion',
    description:
      'Classic regular fit jeans designed for comfortable everyday use.',
    price: 2999,
    countInStock: 35,
  },

  // =====================================================
  // LAPTOPS
  // =====================================================

  {
    user: adminUserId,
    name: 'HP 15 Laptop',
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
    brand: 'HP',
    category: 'Laptops',
    description:
      'HP laptop suitable for study, office work and everyday computing.',
    price: 54999,
    countInStock: 12,
  },

  {
    user: adminUserId,
    name: 'Dell Inspiron 15',
    image:
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800',
    brand: 'Dell',
    category: 'Laptops',
    description:
      'Dell Inspiron laptop designed for productivity and everyday use.',
    price: 57999,
    countInStock: 10,
  },

  {
    user: adminUserId,
    name: 'Lenovo IdeaPad Slim 5',
    image:
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
    brand: 'Lenovo',
    category: 'Laptops',
    description:
      'Slim Lenovo laptop for students, professionals and everyday tasks.',
    price: 62999,
    countInStock: 10,
  },

  {
    user: adminUserId,
    name: 'ASUS Vivobook 15',
    image:
      'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800',
    brand: 'Asus',
    category: 'Laptops',
    description:
      'ASUS Vivobook laptop with a slim design for work and entertainment.',
    price: 59999,
    countInStock: 12,
  },

  // =====================================================
  // SHOES
  // =====================================================

  {
    user: adminUserId,
    name: 'Air Running Shoes',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    brand: 'Nike',
    category: 'Shoes',
    description:
      'Comfortable running shoes designed for daily training.',
    price: 3999,
    countInStock: 30,
  },

  {
    user: adminUserId,
    name: 'Ultraboost Running Shoes',
    image:
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800',
    brand: 'Adidas',
    category: 'Shoes',
    description:
      'Performance running shoes designed for comfort and daily activity.',
    price: 6999,
    countInStock: 25,
  },

  {
    user: adminUserId,
    name: 'Sports Walking Shoes',
    image:
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800',
    brand: 'Puma',
    category: 'Shoes',
    description:
      'Lightweight sports shoes for walking and casual activities.',
    price: 2999,
    countInStock: 35,
  },

  // =====================================================
  // HOME & LIVING
  // =====================================================

  {
    user: adminUserId,
    name: 'LED Smart Bulb',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
    brand: 'Philips',
    category: 'Home & Living',
    description:
      'Energy-efficient LED smart bulb for home lighting.',
    price: 799,
    countInStock: 50,
  },

  {
    user: adminUserId,
    name: 'Modern Storage Box',
    image:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    brand: 'IKEA',
    category: 'Home & Living',
    description:
      'Practical storage box for organizing household items.',
    price: 599,
    countInStock: 45,
  },

  {
    user: adminUserId,
    name: 'Table Lamp',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
    brand: 'Philips',
    category: 'Home & Living',
    description:
      'Modern table lamp suitable for bedrooms, desks and study areas.',
    price: 1299,
    countInStock: 30,
  },

  // =====================================================
  // BOOKS
  // =====================================================

  {
    user: adminUserId,
    name: 'The Power of Habits',
    image:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
    brand: 'Penguin',
    category: 'Books',
    description:
      'A motivational book about habits, routines and personal development.',
    price: 399,
    countInStock: 40,
  },

  {
    user: adminUserId,
    name: 'English Grammar Guide',
    image:
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800',
    brand: 'Oxford',
    category: 'Books',
    description:
      'English grammar reference book for students and learners.',
    price: 499,
    countInStock: 35,
  },

  {
    user: adminUserId,
    name: 'Programming Fundamentals',
    image:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800',
    brand: 'Oxford',
    category: 'Books',
    description:
      'Beginner-friendly programming fundamentals reference book.',
    price: 699,
    countInStock: 25,
  },
]

// =====================================================
// DEFAULT VALUES
// =====================================================

const productsWithDefaults = products.map((product) => ({
  ...product,

  rating: 0,
  numReviews: 0,
  reviews: [],

  isDealActive: false,
  dealDiscount: 0,
  dealStartedAt: null,
  dealExpiresAt: null,
}))

// =====================================================
// IMPORT PRODUCTS
// =====================================================

const importProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log('MongoDB connected')

    await Product.insertMany(productsWithDefaults)

    console.log(
      `${productsWithDefaults.length} products imported successfully`
    )

    await mongoose.connection.close()

    process.exit(0)
  } catch (error) {
    console.error('Import failed:', error.message)

    await mongoose.connection.close()

    process.exit(1)
  }
}

importProducts()