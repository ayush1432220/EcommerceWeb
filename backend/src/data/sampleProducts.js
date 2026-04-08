const sampleProducts = [
  {
    name: "Nova Pro Headphones",
    description: "Premium noise-cancelling wireless headphones with 40-hour battery life.",
    price: 149,
    oldPrice: 229,
    stock: 38,
    emoji: "🎧",
    cat: "Audio",
    brand: "Sony",
    stars: 5,
    badge: "sale",
    isActive: true
  },
  {
    name: "Galaxy Smart Watch",
    description: "Advanced smartwatch with health tracking and AMOLED display.",
    price: 199,
    oldPrice: 249,
    stock: 25,
    emoji: "⌚",
    cat: "Wearables",
    brand: "Samsung",
    stars: 4,
    badge: "new",
    isActive: true
  },
  {
    name: "Ultra Gaming Mouse",
    description: "Ergonomic gaming mouse with RGB lighting and 16000 DPI sensor.",
    price: 59,
    oldPrice: 79,
    stock: 50,
    emoji: "🖱️",
    cat: "Accessories",
    brand: "Logitech",
    stars: 4,
    badge: "hot",
    isActive: true
  },
  {
    name: "MacBook Air M2",
    description: "Lightweight laptop with powerful M2 chip and long battery life.",
    price: 999,
    oldPrice: 1199,
    stock: 15,
    emoji: "💻",
    cat: "Laptops",
    brand: "Apple",
    stars: 5,
    badge: "premium",
    isActive: true
  },
  {
    name: "4K Ultra HD TV",
    description: "55-inch smart TV with Dolby Vision and built-in apps.",
    price: 699,
    oldPrice: 899,
    stock: 20,
    emoji: "📺",
    cat: "Electronics",
    brand: "LG",
    stars: 4,
    badge: "sale",
    isActive: true
  },
  {
    name: "Wireless Bluetooth Speaker",
    description: "Portable speaker with deep bass and 12-hour battery life.",
    price: 89,
    oldPrice: 129,
    stock: 60,
    emoji: "🔊",
    cat: "Audio",
    brand: "JBL",
    stars: 4,
    badge: "trending",
    isActive: true
  },
  {
    name: "iPhone 14",
    description: "Latest smartphone with A15 chip and advanced camera system.",
    price: 799,
    oldPrice: 899,
    stock: 30,
    emoji: "📱",
    cat: "Mobiles",
    brand: "Apple",
    stars: 5,
    badge: "new",
    isActive: true
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with blue switches for gaming.",
    price: 109,
    oldPrice: 149,
    stock: 45,
    emoji: "⌨️",
    cat: "Accessories",
    brand: "Corsair",
    stars: 4,
    badge: "hot",
    isActive: true
  },
  {
    name: "Aero Stride Sneakers",
    description: "Lightweight running sneakers with springy cushioning for all-day comfort.",
    price: 89,
    oldPrice: null,
    stock: 52,
    emoji: "👟",
    cat: "Footwear",
    brand: "Nike",
    stars: 4,
    badge: "new",
    isActive: true
  },
  {
    name: "Timeless Smart Watch",
    description: "Sophisticated smartwatch with full health tracking.",
    price: 299,
    oldPrice: 399,
    stock: 24,
    emoji: "⌚",
    cat: "Watches",
    brand: "Apple",
    stars: 5,
    badge: "hot",
    isActive: true
  },

  // Mobiles
  {
    name: "Samsung Galaxy S23",
    description: "Flagship Android phone with AMOLED display.",
    price: 749,
    oldPrice: 899,
    stock: 28,
    emoji: "📱",
    cat: "Mobiles",
    brand: "Samsung",
    stars: 5,
    badge: "sale",
    isActive: true
  },
  {
    name: "OnePlus 11",
    description: "Fast and smooth smartphone with Snapdragon processor.",
    price: 699,
    oldPrice: 799,
    stock: 35,
    emoji: "📱",
    cat: "Mobiles",
    brand: "OnePlus",
    stars: 4,
    badge: "hot",
    isActive: true
  },

  // Laptops
  {
    name: "Dell XPS 13",
    description: "Compact and powerful ultrabook.",
    price: 1099,
    oldPrice: 1299,
    stock: 12,
    emoji: "💻",
    cat: "Laptops",
    brand: "Dell",
    stars: 5,
    badge: "premium",
    isActive: true
  },
  {
    name: "HP Pavilion 15",
    description: "Affordable laptop for everyday use.",
    price: 599,
    oldPrice: 699,
    stock: 20,
    emoji: "💻",
    cat: "Laptops",
    brand: "HP",
    stars: 4,
    badge: "sale",
    isActive: true
  },

  // Audio
  {
    name: "Sony WH-1000XM5",
    description: "Top-tier noise cancelling headphones.",
    price: 349,
    oldPrice: 399,
    stock: 25,
    emoji: "🎧",
    cat: "Audio",
    brand: "Sony",
    stars: 5,
    badge: "premium",
    isActive: true
  },

  // Fashion
  {
    name: "Nike Running Shoes",
    description: "Lightweight shoes for running.",
    price: 120,
    oldPrice: 150,
    stock: 40,
    emoji: "👟",
    cat: "Fashion",
    brand: "Nike",
    stars: 5,
    badge: "trending",
    isActive: true
  },
  {
    name: "Adidas Sneakers",
    description: "Stylish everyday sneakers.",
    price: 110,
    oldPrice: 140,
    stock: 38,
    emoji: "👟",
    cat: "Fashion",
    brand: "Adidas",
    stars: 4,
    badge: "hot",
    isActive: true
  },

  // Home & Fitness
  {
    name: "Air Fryer",
    description: "Healthy oil-free cooking appliance.",
    price: 99,
    oldPrice: 129,
    stock: 30,
    emoji: "🍳",
    cat: "Home",
    brand: "Philips",
    stars: 5,
    badge: "trending",
    isActive: true
  },
  {
    name: "Yoga Mat",
    description: "Non-slip exercise mat.",
    price: 25,
    oldPrice: 35,
    stock: 90,
    emoji: "🧘",
    cat: "Fitness",
    brand: "Decathlon",
    stars: 4,
    badge: "hot",
    isActive: true
  },

  // Beauty & Toys
  {
    name: "Perfume",
    description: "Long-lasting fragrance.",
    price: 89,
    oldPrice: 120,
    stock: 40,
    emoji: "🌸",
    cat: "Beauty",
    brand: "Dior",
    stars: 5,
    badge: "premium",
    isActive: true
  },
  {
    name: "Kids Toy Car",
    description: "Remote control toy car.",
    price: 35,
    oldPrice: 50,
    stock: 70,
    emoji: "🚗",
    cat: "Toys",
    brand: "HotWheels",
    stars: 4,
    badge: "hot",
    isActive: true
  }
];

export default sampleProducts;