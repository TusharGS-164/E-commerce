const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

// Sample users
const users = [
  {
    name: 'Admin User',
    email: 'admin@ecommerce.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Tushar GS',
    email: 'tushargs1604@gmail.com',
    password: 'Tushar123',
    role: 'admin'
  },
];

// Expanded product catalog - 50+ products
const products = [
  // Computers & Laptops
  {
    name: 'MacBook Pro 16" M3 Max',
    description: 'Most powerful MacBook Pro ever with M3 Max chip, 16" Liquid Retina XDR display, up to 128GB unified memory, and up to 8TB SSD storage.',
    price: 349900,
    category: 'Computers & Laptops',
    brand: 'Apple',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
    rating: 4.9,
    numReviews: 287,
    featured: true
  },
  {
    name: 'Dell XPS 15 Gaming Laptop',
    description: '15.6" 4K OLED display, Intel Core i9, NVIDIA RTX 4070, 32GB RAM, 1TB SSD. Perfect for content creation and gaming.',
    price: 357200,
    category: 'Computers & Laptops',
    brand: 'Dell',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500'],
    rating: 4.7,
    numReviews: 156,
    featured: true
  },
  {
    name: 'HP Spectre x360 Convertible',
    description: '13.5" OLED touchscreen, Intel Core i7, 16GB RAM, 512GB SSD. Ultra-portable 2-in-1 design with pen support.',
    price: 185900,
    category: 'Computers & Laptops',
    brand: 'HP',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'],
    rating: 4.6,
    numReviews: 203,
    featured: false
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon',
    description: 'Business ultrabook with 14" display, Intel Core i7, 16GB RAM, 512GB SSD. Military-grade durability.',
    price: 297380,
    category: 'Computers & Laptops',
    brand: 'Lenovo',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500'],
    rating: 4.8,
    numReviews: 178,
    featured: false
  },
  {
    name: 'ASUS ROG Zephyrus G14',
    description: 'Gaming laptop with AMD Ryzen 9, NVIDIA RTX 4060, 16GB RAM, 1TB SSD. Compact 14" design with incredible performance.',
    price: 199990,
    category: 'Computers & Laptops',
    brand: 'ASUS',
    stock: 18,
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500'],
    rating: 4.7,
    numReviews: 142,
    featured: true
  },
  {
  name: 'Dell XPS 15',
  description: 'Premium performance laptop from Dell.',
  price: 253341,
  category: 'Computers & Laptops',
  brand: 'Dell',
  stock: 20,
  images: ['https://tse1.mm.bing.net/th/id/OIP.Pl5fX536WWEhSJts73qRMwHaFj?pid=Api&P=0&h=180'],
  rating: 4.8,
  numReviews: 198,
  featured: true
},
{
  name: 'HP Spectre x360 14',
  description: 'Convertible premium laptop from HP.',
  price: 143990,
  category: 'Computers & Laptops',
  brand: 'HP',
  stock: 25,
  images: ['https://tse4.mm.bing.net/th/id/OIP.Iqfk6jovVE9VHPKB1xmQIwHaEK?pid=Api&P=0&h=180'],
  rating: 4.7,
  numReviews: 154,
  featured: false
},
{
  name: 'Lenovo ThinkPad X1 Carbon Gen 12',
  description: 'Business-class lightweight laptop from Lenovo.',
  price: 170196,
  category: 'Computers & Laptops',
  brand: 'Lenovo',
  stock: 18,
  images: ['https://sm.pcmag.com/t/pcmag_au/review/l/lenovo-thi/lenovo-thinkpad-x1-carbon-gen-12_g1tq.1920.jpg'],
  rating: 4.8,
  numReviews: 212,
  featured: true
},
{
  name: 'ASUS ROG Strix G16',
  description: 'High-performance gaming laptop from ASUS.',
  price: 169990,
  category: 'Computers & Laptops',
  brand: 'ASUS',
  stock: 30,
  images: ['https://m.media-amazon.com/images/I/71zuMSjwDfL._AC_SL1500_.jpg'],
  rating: 4.7,
  numReviews: 143,
  featured: true
},
{
  name: 'Acer Predator Helios 16',
  description: 'Gaming-focused laptop from Acer.',
  price: 181990,
  category: 'Computers & Laptops',
  brand: 'Acer',
  stock: 22,
  images: ['https://microless.com/cdn/products/f9762f84c9ef072c81b5623c549dbc1a-hi.jpg'],
  rating: 4.6,
  numReviews: 167,
  featured: false
},
{
  name: 'Microsoft Surface Laptop 6',
  description: 'Sleek productivity laptop from Microsoft.',
  price: 229896,
  category: 'Computers & Laptops',
  brand: 'Microsoft',
  stock: 28,
  images: ['https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSFT-Surface-Laptop-6-Sneak-Curosel-Pivot-3?scl=1'],
  rating: 4.6,
  numReviews: 119,
  featured: false
},
{
  name: 'Apple iMac 24" M3',
  description: 'All-in-one desktop computer from Apple.',
  price: 134900,
  category: 'Computers & Laptops',
  brand: 'Apple',
  stock: 12,
  images: ['https://s.yimg.com/uu/api/res/1.2/PfqaU8L6.UPhF3awbz4uhg--~B/aD0xMjI4O3c9MTg4MzthcHBpZD15dGFjaHlvbg--/https://media-mbst-pub-ue1.s3.amazonaws.com/creatr-uploaded-images/2023-11/f91dccc0-7fd7-11ee-bbde-92a69b2b206c.cf.jpg'],
  rating: 4.9,
  numReviews: 134,
  featured: true
},



  // Smartphones & Tablets
  {
    name: 'iPhone 15 Pro Max',
    description: 'Titanium design, A17 Pro chip, 6.7" Super Retina XDR display, advanced camera system with 5x telephoto.',
    price: 123999,
    category: 'Smartphones & Tablets',
    brand: 'Apple',
    stock: 50,
    images: ['https://images.unsplash.com/photo-1695048133021-be2def43f3b2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    rating: 4.9,
    numReviews: 423,
    featured: true
  },
 
  {
  name: 'Samsung Galaxy S24 Ultra',
  description: 'Titanium frame, Snapdragon 8 Gen 3 processor, 6.8" Dynamic AMOLED 2X display, 200MP quad camera with 5x optical zoom.',
  price: 128999,
  category: 'Smartphones & Tablets',
  brand: 'Samsung',
  stock: 35,
  images: ['https://images.unsplash.com/photo-1705585175110-d25f92c183aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2Ftc3VuZyUyMGdhbGF4eSUyMHMyNHxlbnwwfHwwfHx8MA%3D%3D'],
  rating: 4.8,
  numReviews: 389,
  featured: true
},
{
  name: 'Google Pixel 8 Pro',
  description: 'Google Tensor G3 chip, 6.7" LTPO OLED display, advanced AI photography features, 50MP triple camera system.',
  price: 42199,
  category: 'Smartphones & Tablets',
  brand: 'Google',
  stock: 42,
  images: ['https://images.unsplash.com/photo-1697355360151-2866de32ad4d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z29vZ2xlJTIwcGl4ZWwlMjA4JTIwcHJvfGVufDB8fDB8fHww'],
  rating: 4.7,
  numReviews: 276,
  featured: true
},
{
  name: 'Samsung Galaxy S25 Ultra',
  description: 'Premium Samsung flagship smartphone.',
  price: 129999,
  category: 'Smartphones & Tablets',
  brand: 'Samsung',
  stock: 40,
  images: ['https://m.media-amazon.com/images/I/61uvatjvVYL._AC_SL1500_.jpg','https://img.tuttoandroid.net/wp-content/uploads/2024/11/Samsung-Galaxy-S25-Ultra-render-by-Technizo-01-scaled.jpg'],
  rating: 4.8,
  numReviews: 312,
  featured: true
},
{
  name: 'Google Pixel 9 Pro',
  description: 'Latest Google Pixel smartphone.',
  price: 109999,
  category: 'Smartphones & Tablets',
  brand: 'Google',
  stock: 35,
  images: ['https://pisces.bbystatic.com/image2/BestBuy_US/images/products/df9c78b6-693b-4060-b888-011eb20facb4.jpg'],
  rating: 4.7,
  numReviews: 221,
  featured: true
},
{
  name: 'OnePlus 13',
  description: 'Flagship OnePlus smartphone.',
  price: 67999,
  category: 'Smartphones & Tablets',
  brand: 'OnePlus',
  stock: 50,
  images: ['https://www.droid-life.com/wp-content/uploads/2024/10/OnePlus-13-Blue-1920x1317.jpg'],
  rating: 4.6,
  numReviews: 184,
  featured: false
},
{
  name: 'Xiaomi 15',
  description: 'High-performance Xiaomi smartphone.',
  price: 64999,
  category: 'Smartphones & Tablets',
  brand: 'Xiaomi',
  stock: 60,
  images: ['https://mi-home.pl/cdn/shop/files/15-black.png?v=1740922563&width=1646'],
  rating: 4.5,
  numReviews: 140,
  featured: false
},
{
  name: 'Nothing Phone (3)',
  description: 'Modern smartphone from Nothing.',
  price: 58950,
  category: 'Smartphones & Tablets',
  brand: 'Nothing',
  stock: 45,
  images: ['https://ag4tech.com/wp-content/uploads/2023/11/nothing-phone-3-release-date.webp'],
  rating: 4.4,
  numReviews: 97,
  featured: false
},
{
  name: 'Motorola Edge 60 Pro',
  description: 'Motorola premium smartphone.',
  price: 289889,
  category: 'Smartphones & Tablets',
  brand: 'Motorola',
  stock: 55,
  images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=1170&auto=format&fit=crop'],
  rating: 4.5,
  numReviews: 163,
  featured: false
},
{
  name: 'Realme GT 6',
  description: 'Realme performance smartphone.',
  price: 35999,
  category: 'Smartphones & Tablets',
  brand: 'Realme',
  stock: 70,
  images: ['https://m.media-amazon.com/images/I/718p48pvjPL.jpg'],
  rating: 4.6,
  numReviews: 208,
  featured: false
},
{
  name: 'Vivo X100',
  description: 'Vivo flagship smartphone.',
  price: 63999,
  category: 'Smartphones & Tablets',
  brand: 'Vivo',
  stock: 30,
  images: ['https://asia-exstatic-vivofs.vivo.com/PSee2l50xoirPK7y/1702882620686/2948ef675bc40de94b1ee85acdafe210.png'],
  rating: 4.7,
  numReviews: 176,
  featured: true
},

{
  name: 'Samsung Galaxy A55 5G',
  description: 'Exynos 1480 processor, 6.6" Super AMOLED 120Hz display, 50MP triple camera, long-lasting 5000mAh battery.',
  price: 29999,
  category: 'Smartphones & Tablets',
  brand: 'Samsung',
  stock: 75,
  images: ['https://images.samsung.com/is/image/samsung/p6pim/fr/sm-a556bzkaeub/gallery/fr-galaxy-a55-5g-sm-a556-sm-a556bzkaeub-thumb-540291759'],
  rating: 4.5,
  numReviews: 154,
  featured: false
},
{
  name: 'Xiaomi 14',
  description: 'Snapdragon 8 Gen 3, 6.36" AMOLED display, Leica-powered triple camera system, 90W fast charging.',
  price: 59999,
  category: 'Smartphones & Tablets',
  brand: 'Xiaomi',
  stock: 50,
  images: ['https://www.gizmochina.com/wp-content/uploads/2023/10/14-Pro.jpg'],
  rating: 4.6,
  numReviews: 210,
  featured: true
},
{
  name: 'Nothing Phone (2)',
  description: 'Snapdragon 8+ Gen 1, 6.7" OLED display, Glyph interface design, dual 50MP camera system.',
  price: 38999,
  category: 'Smartphones & Tablets',
  brand: 'Nothing',
  stock: 48,
  images: ['https://images.unsplash.com/photo-1711129250403-9a6d65d3b09f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bm90aGluZyUyMHBob25lJTIwMnxlbnwwfHwwfHx8MA%3D%3D'],
  rating: 4.4,
  numReviews: 132,
  featured: false
},

  
  {
    name: 'iPad Pro 12.9" M2',
    description: 'Ultimate tablet with M2 chip, Liquid Retina XDR display, supports Apple Pencil and Magic Keyboard.',
    price: 112399,
    category: 'Smartphones & Tablets',
    brand: 'Apple',
    stock: 28,
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500'],
    rating: 4.9,
    numReviews: 198,
    featured: true
  },
  {
    name: 'Samsung Galaxy Tab S9 Ultra',
    description: '14.6" AMOLED display, Snapdragon 8 Gen 2, S Pen included, perfect for productivity and creativity.',
    price: 108799,
    category: 'Smartphones & Tablets',
    brand: 'Samsung',
    stock: 22,
    images: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500'],
    rating: 4.7,
    numReviews: 134,
    featured: false
  },
  {
    name: 'OnePlus 12',
    description: 'Flagship killer with Snapdragon 8 Gen 3, 120Hz AMOLED display, 100W fast charging.',
    price: 64999,
    category: 'Smartphones & Tablets',
    brand: 'OnePlus',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'],
    rating: 4.6,
    numReviews: 189,
    featured: false
  },

  // Audio & Headphones
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation, 30-hour battery, exceptional sound quality, multipoint connection.',
    price: 30000,
    category: 'Audio & Headphones',
    brand: 'Sony',
    stock: 60,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    rating: 4.8,
    numReviews: 512,
    featured: true
  },
  
 
  {
    name: 'Sennheiser Momentum 4',
    description: 'Audiophile-grade wireless headphones with 60-hour battery and adaptive ANC.',
    price: 22900,
    category: 'Audio & Headphones',
    brand: 'Sennheiser',
    stock: 35,
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500'],
    rating: 4.9,
    numReviews: 234,
    featured: false
  },
  {
    name: 'JBL Flip 6 Portable Speaker',
    description: 'Waterproof Bluetooth speaker with powerful bass and 12-hour playtime.',
    price: 7300,
    category: 'Audio & Headphones',
    brand: 'JBL',
    stock: 85,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'],
    rating: 4.6,
    numReviews: 456,
    featured: false
  },
  {
    name: 'Sonos One SL Smart Speaker',
    description: 'Powerful sound in compact design, works with all major music services.',
    price: 20700,
    category: 'Audio & Headphones',
    brand: 'Sonos',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500'],
    rating: 4.7,
    numReviews: 321,
    featured: false
  },
{
  name: 'Apple AirPods Pro (2nd Generation)',
  description: 'Premium wireless earbuds with active noise cancellation.',
  price: 18900,
  category: 'Audio & Headphones',
  brand: 'Apple',
  stock: 75,
  images: ['https://tse2.mm.bing.net/th/id/OIP.zYGEzAbC8iZNbItNDe0V9QHaEK?pid=Api&P=0&h=180'],
  rating: 4.8,
  numReviews: 684,
  featured: true
},
{
  name: 'Bose QuietComfort Ultra Headphones',
  description: 'High-end noise cancelling over-ear headphones.',
  price: 35900,
  category: 'Audio & Headphones',
  brand: 'Bose',
  stock: 40,
  images: ['https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6554/6554464_sd.jpg'],
  rating: 4.7,
  numReviews: 321,
  featured: true
},
{
  name: 'Beats Studio Pro',
  description: 'Stylish wireless over-ear headphones with immersive sound.',
  price: 37900,
  category: 'Audio & Headphones',
  brand: 'Beats',
  stock: 55,
  images: ['https://www.beatsbydre.com/content/dam/beats/web/product/headphones/studiopro-wireless/pdp/studiopro-pdp-p08.png.large.2x.png'],
  rating: 4.6,
  numReviews: 198,
  featured: false
},
{
  name: 'Samsung Galaxy Buds2 Pro',
  description: 'Compact true wireless earbuds with active noise cancellation.',
  price: 16990,
  category: 'Audio & Headphones',
  brand: 'Samsung',
  stock: 80,
  images: ['https://hifi.de/wp-content/uploads/2022/08/samsung-galaxy-buds2-pro-titelbild-1536x768.jpg'],
  rating: 4.7,
  numReviews: 274,
  featured: false
},
{
  name: 'JBL Tune 770NC',
  description: 'Wireless over-ear headphones with adaptive noise cancelling.',
  price: 4999,
  category: 'Audio & Headphones',
  brand: 'JBL',
  stock: 90,
  images: ['https://m.media-amazon.com/images/I/61NudoNt44L._AC_.jpg'],
  rating: 4.5,
  numReviews: 156,
  featured: false
},
{
  name: 'Sennheiser Momentum 4 Wireless',
  description: 'Premium over-ear wireless headphones with superior sound.',
  price: 22900,
  category: 'Audio & Headphones',
  brand: 'Sennheiser',
  stock: 35,
  images: ['https://tse2.mm.bing.net/th/id/OIP.vvEWMm-scpxftQdDBtynWwHaHa?pid=Api&P=0&h=180'],
  rating: 4.8,
  numReviews: 243,
  featured: true
},
{
  name: 'Sony WF-1000XM5 Earbuds',
  description: 'Flagship true wireless earbuds with advanced noise cancellation.',
  price: 22989,
  category: 'Audio & Headphones',
  brand: 'Sony',
  stock: 65,
  images: ['https://tse2.mm.bing.net/th/id/OIP.h3MT1uhxOLjgg4125obHEwHaF0?pid=Api&P=0&h=180'],
  rating: 4.7,
  numReviews: 401,
  featured: true
},

  // Cameras & Photography
 
  {
    name: 'Canon EOS R6 Mark II',
    description: 'High-performance hybrid camera with 24MP sensor, 8K video, and intelligent autofocus.',
    price: 188990,
    category: 'Cameras & Photography',
    brand: 'Canon',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500'],
    rating: 4.8,
    numReviews: 134,
    featured: true
  },
  
  {
    name: 'DJI Mini 3 Pro Drone',
    description: 'Compact drone with 4K HDR video, obstacle avoidance, 34-minute flight time.',
    price: 75000,
    category: 'Cameras & Photography',
    brand: 'DJI',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500'],
    rating: 4.8,
    numReviews: 267,
    featured: true
  },
  {
    name: 'GoPro Hero 12 Black',
    description: 'Latest action camera with 5.3K video, HyperSmooth stabilization, waterproof design.',
    price: 29900,
    category: 'Cameras & Photography',
    brand: 'GoPro',
    stock: 45,
    images: ['https://images.unsplash.com/photo-1555611637-09de5810478e?q=80&w=1124&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    rating: 4.7,
    numReviews: 389,
    featured: false
  },
  {
  name: 'Sony Alpha a7 IV',
  description: 'Full-frame mirrorless camera for photography and video.',
  price: 182990,
  category: 'Cameras & Photography',
  brand: 'Sony',
  stock: 18,
  images: ['https://tse1.mm.bing.net/th/id/OIP.6Gbm1ZaOhljtAqfYV8Vd9QHaE8?pid=Api&P=0&h=180'],
  rating: 4.9,
  numReviews: 176,
  featured: true
},
{
  name: 'Nikon Z8',
  description: 'Professional mirrorless camera with advanced performance.',
  price: 266490,
  category: 'Cameras & Photography',
  brand: 'Nikon',
  stock: 10,
  images: ['https://tse4.mm.bing.net/th/id/OIP.axjmhVetTOX2-i0KTxpynAHaHw?pid=Api&P=0&h=180'],
  rating: 4.9,
  numReviews: 98,
  featured: true
},

{
  name: 'Panasonic Lumix GH6',
  description: 'Hybrid mirrorless camera built for creators.',
  price: 165999,
  category: 'Cameras & Photography',
  brand: 'Panasonic',
  stock: 14,
  images: ['https://tse3.mm.bing.net/th/id/OIP.dhM5DcwZLbOMhSTLwLW8YwHaE_?pid=Api&P=0&h=180'],
  rating: 4.7,
  numReviews: 112,
  featured: false
},
{
  name: 'Canon EOS R5',
  description: 'High-resolution full-frame mirrorless camera.',
  price: 315399,
  category: 'Cameras & Photography',
  brand: 'Canon',
  stock: 12,
  images: ['https://i1.adis.ws/i/canon/4147C025_EOS_R5_02?w=940&bg=rgb(245,246,246)&fmt=webp&qlt=80&sm=aspect&aspect=1:1'],
  rating: 4.9,
  numReviews: 210,
  featured: true
},
{
  name: 'Sony ZV-E10',
  description: 'Compact mirrorless camera designed for content creators.',
  price: 66399,
  category: 'Cameras & Photography',
  brand: 'Sony',
  stock: 25,
  images: ['https://s.yimg.com/uu/api/res/1.2/.1V9_7HpeQlDP7gVxiZsng--~B/aD0xNTc5O3c9MjUwMDthcHBpZD15dGFjaHlvbg--/https://s.yimg.com/os/creatr-uploaded-images/2021-07/3a768330-eeec-11eb-9fbf-1ce709229319.cf.jpg'],
  rating: 4.7,
  numReviews: 265,
  featured: false
},
{
  name: 'GoPro HERO12 Black',
  description: 'Rugged action camera for adventure and sports.',
  price: 33199,
  category: 'Cameras & Photography',
  brand: 'GoPro',
  stock: 35,
  images: ['https://tse2.mm.bing.net/th/id/OIP.JT2WTF9mwq_eUG9HGtMvVwHaGr?pid=Api&P=0&h=180'],
  rating: 4.6,
  numReviews: 342,
  featured: false
},


  // Gaming
  {
    name: 'PlayStation 5 Slim',
    description: 'Next-gen console with ultra-high speed SSD, ray tracing, 4K gaming up to 120fps.',
    price: 41499,
    category: 'Gaming',
    brand: 'Sony',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500'],
    rating: 4.9,
    numReviews: 1234,
    featured: true
  },
  {
    name: 'Xbox Series X',
    description: 'Most powerful Xbox ever with 12 teraflops of processing power, Quick Resume feature.',
    price: 41999,
    category: 'Gaming',
    brand: 'Microsoft',
    stock: 28,
    images: ['https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500'],
    rating: 4.8,
    numReviews: 987,
    featured: true
  },
  {
    name: 'Nintendo Switch OLED',
    description: '7-inch OLED screen, enhanced audio, 64GB storage, play at home or on the go.',
    price: 29049,
    category: 'Gaming',
    brand: 'Nintendo',
    stock: 55,
    images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500'],
    rating: 4.7,
    numReviews: 876,
    featured: true
  },
  {
    name: 'Steam Deck OLED',
    description: 'Handheld gaming PC with OLED display, play your entire Steam library anywhere.',
    price: 53949,
    category: 'Gaming',
    brand: 'Valve',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=500'],
    rating: 4.8,
    numReviews: 456,
    featured: true
  },
  {
    name: 'Razer DeathAdder V3 Pro',
    description: 'Wireless gaming mouse with Focus Pro 30K sensor, 90-hour battery life.',
    price: 12499,
    category: 'Gaming',
    brand: 'Razer',
    stock: 70,
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'],
    rating: 4.7,
    numReviews: 342,
    featured: false
  },
  {
    name: 'Logitech G Pro X Superlight',
    description: 'Ultra-lightweight wireless gaming mouse at 63g, HERO 25K sensor.',
    price: 41499,
    category: 'Gaming',
    brand: 'Logitech',
    stock: 65,
    images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500'],
    rating: 4.8,
    numReviews: 523,
    featured: false
  },

  // Wearables
  {
    name: 'Apple Watch Series 9',
    description: 'Advanced health features, always-on Retina display, GPS + Cellular, 18-hour battery.',
    price: 35689,
    category: 'Wearables',
    brand: 'Apple',
    stock: 55,
    images: ['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500'],
    rating: 4.8,
    numReviews: 789,
    featured: true
  },
 
  {
    name: 'Garmin Fenix 7X Sapphire',
    description: 'Premium multisport GPS watch with solar charging, topographic maps, 28-day battery.',
    price: 74699,
    category: 'Wearables',
    brand: 'Garmin',
    stock: 18,
    images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500'],
    rating: 4.9,
    numReviews: 234,
    featured: false
  },
  {
    name: 'Fitbit Charge 6',
    description: 'Advanced fitness tracker with GPS, heart rate monitoring, 7-day battery life.',
    price: 13279,
    category: 'Wearables',
    brand: 'Fitbit',
    stock: 80,
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500'],
    rating: 4.6,
    numReviews: 567,
    featured: false
  },
 {
  name: 'Samsung Galaxy Watch 6 Classic',
  description: 'Premium smartwatch with advanced health tracking.',
  price: 33199,
  category: 'Wearables',
  brand: 'Samsung',
  stock: 40,
  images: ['https://tse4.mm.bing.net/th/id/OIP.lMwpd0nCqmqU0ukYX1_iYwHaHa?pid=Api&P=0&h=180'],
  rating: 4.7,
  numReviews: 412,
  featured: true
},
{
  name: 'Google Pixel Watch 2',
  description: 'Smartwatch with Fitbit-powered health features.',
  price: 29049,
  category: 'Wearables',
  brand: 'Google',
  stock: 38,
  images: ['https://tse4.mm.bing.net/th/id/OIP._UUfmWD44fOrsYDVqftQhwHaIL?pid=Api&P=0&h=180'],
  rating: 4.6,
  numReviews: 268,
  featured: false
},
{
  name: 'Garmin Forerunner 965',
  description: 'Advanced GPS smartwatch designed for athletes.',
  price: 49799,
  category: 'Wearables',
  brand: 'Garmin',
  stock: 22,
  images: ['https://tse2.mm.bing.net/th/id/OIP.8-ZDojrm3NIb1hthdtPvDQHaHa?pid=Api&P=0&h=180'],
  rating: 4.8,
  numReviews: 301,
  featured: true
},

{
  name: 'Apple Watch Ultra 2',
  description: 'Rugged and powerful smartwatch for extreme activities.',
  price: 66399,
  category: 'Wearables',
  brand: 'Apple',
  stock: 30,
  images: ['https://tse4.mm.bing.net/th/id/OIP.yIzRAOoy6K_V84Q3f8Z_UgHaIf?pid=Api&P=0&h=180'],
  rating: 4.9,
  numReviews: 245,
  featured: true
},
{
  name: 'Huawei Watch GT 4',
  description: 'Stylish smartwatch with long battery life.',
  price: 20749,
  category: 'Wearables',
  brand: 'Huawei',
  stock: 50,
  images: ['https://static1.pocketnowimages.com/wordpress/wp-content/uploads/2023/09/pbi-huawei-watch-gt-4-rainforest-green-gmt.png'],
  rating: 4.6,
  numReviews: 189,
  featured: false
},
{
  name: 'Amazfit GTR 4',
  description: 'Affordable smartwatch with comprehensive fitness tracking.',
  price: 16599,
  category: 'Wearables',
  brand: 'Amazfit',
  stock: 65,
  images: ['https://tse4.mm.bing.net/th/id/OIP.xE0JW5JbnYVNR6vvkMqsHQHaHa?pid=Api&P=0&h=180'],
  rating: 4.4,
  numReviews: 221,
  featured: false
},
 

  // Accessories
  {
    name: 'Anker 737 Power Bank',
    description: '24,000mAh capacity, 140W fast charging, charges laptops and phones.',
    price: 12499,
    category: 'Accessories',
    brand: 'Anker',
    stock: 95,
    images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500'],
    rating: 4.7,
    numReviews: 456,
    featured: false
  },
 
  {
    name: 'Samsung T7 Portable SSD 2TB',
    description: 'Ultra-fast external storage with USB 3.2 Gen 2, up to 1050MB/s read speeds.',
    price: 20749,
    category: 'Accessories',
    brand: 'Samsung',
    stock: 75,
    images: ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500'],
    rating: 4.8,
    numReviews: 567,
    featured: false
  },
  {
    name: 'Logitech MX Master 3S',
    description: 'Advanced wireless mouse for professionals with customizable buttons and precision scrolling.',
    price: 8299,
    category: 'Accessories',
    brand: 'Logitech',
    stock: 120,
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'],
    rating: 4.8,
    numReviews: 678,
    featured: false
  },
  {
    name: 'Keychron Q1 Pro Mechanical Keyboard',
    description: 'Premium wireless mechanical keyboard with hot-swappable switches and RGB.',
    price: 16599,
    category: 'Accessories',
    brand: 'Keychron',
    stock: 45,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'],
    rating: 4.9,
    numReviews: 289,
    featured: true
  },
  {
    name: 'Elgato Stream Deck MK.2',
    description: 'Customizable control panel with 15 LCD keys for streamers and content creators.',
    price: 12499,
    category: 'Accessories',
    brand: 'Elgato',
    stock: 38,
    images: ['https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=500'],
    rating: 4.7,
    numReviews: 345,
    featured: false
  },
  {
    name: 'Blue Yeti X USB Microphone',
    description: 'Professional condenser microphone with high-res LED metering and blue VO!CE effects.',
    price: 12499,
    category: 'Accessories',
    brand: 'Blue',
    stock: 52,
    images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500'],
    rating: 4.8,
    numReviews: 412,
    featured: false
  },

  // Smart Home
 
  {
    name: 'Google Nest Hub Max',
    description: '10" smart display with Nest Cam, face recognition, and home control.',
    price: 19089,
    category: 'Smart Home',
    brand: 'Google',
    stock: 50,
    images: ['https://images.unsplash.com/photo-1558346547-4439467bd1d5?w=500'],
    rating: 4.6,
    numReviews: 298,
    featured: false
  },

 
  // Additional Electronics
  {
    name: 'LG 48" OLED C3 TV',
    description: '4K OLED TV with AI-powered processor, perfect for gaming with 120Hz and VRR.',
    price: 124999,
    category: 'Electronics',
    brand: 'LG',
    stock: 12,
    images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500'],
    rating: 4.9,
    numReviews: 567,
    featured: true
  },
  {
  name: 'Samsung 55" Neo QLED QN90C',
  description: 'Premium 4K Neo QLED smart TV with immersive picture quality.',
  price: 149399,
  category: 'Electronics',
  brand: 'Samsung',
  stock: 15,
  images: ['https://tse1.mm.bing.net/th/id/OIP.FLTxNw9lCnZWvH9C83-w1wHaEm?pid=Api&P=0&h=180'],
  rating: 4.8,
  numReviews: 421,
  featured: true
},
{
  name: 'Sony 65" BRAVIA XR A80L OLED',
  description: 'High-end OLED TV with cinematic viewing experience.',
  price: 190899,
  category: 'Electronics',
  brand: 'Sony',
  stock: 8,
  images: ['https://m.media-amazon.com/images/I/81aMS6p4xlL.jpg'],
  rating: 4.9,
  numReviews: 312,
  featured: true
},
{
  name: 'TCL 65" 6-Series Mini-LED',
  description: 'Affordable 4K Mini-LED smart TV with vibrant colors.',
  price: 82999,
  category: 'Electronics',
  brand: 'TCL',
  stock: 20,
  images: ['https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6424/6424216ld.jpg'],
  rating: 4.6,
  numReviews: 289,
  featured: false
},
{
  name: 'Hisense 55" U8K ULED',
  description: 'Bright and powerful 4K smart TV for entertainment.',
  price: 74699,
  category: 'Electronics',
  brand: 'Hisense',
  stock: 18,
  images: ['https://tse3.mm.bing.net/th/id/OIP.IbpqeUgRCBos_ERByI7USwHaEp?pid=Api&P=0&h=180'],
  rating: 4.5,
  numReviews: 198,
  featured: false
},
{
  name: 'LG 65" OLED G3 Series',
  description: 'Gallery design OLED TV with premium display performance.',
  price: 232399,
  category: 'Electronics',
  brand: 'LG',
  stock: 6,
  images: ['https://tse4.mm.bing.net/th/id/OIP.oxmS-Q4Xk6OnDs1PFkNMogHaE6?pid=Api&P=0&h=180'],
  rating: 4.9,
  numReviews: 255,
  featured: true
},
{
  name: 'Samsung 75" Crystal UHD CU8000',
  description: 'Large-screen 4K UHD smart TV with sleek design.',
  price: 99599,
  category: 'Electronics',
  brand: 'Samsung',
  stock: 10,
  images: ['https://images-na.ssl-images-amazon.com/images/I/81g6xeGzK2L.jpg'],
  rating: 4.7,
  numReviews: 344,
  featured: false
},
{
  name: 'Sony 50" X90L 4K LED',
  description: 'Balanced 4K LED smart TV with smooth motion performance.',
  price: 91299,
  category: 'Electronics',
  brand: 'Sony',
  stock: 14,
  images: ['https://cdn1.smartprix.com/rx-iG3BueKAV-w1200-h1200/G3BueKAV.jpg'],
  rating: 4.8,
  numReviews: 276,
  featured: false
},

  {
    name: 'Bose SoundLink Revolve+ II',
    description: '360-degree Bluetooth speaker with 17-hour battery, water-resistant design.',
    price: 29389,
    category: 'Audio & Headphones',
    brand: 'Bose',
    stock: 48,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'],
    rating: 4.7,
    numReviews: 289,
    featured: false
  },
  {
    name: 'Meta Quest 3',
    description: 'Next-gen VR headset with mixed reality, higher resolution, powerful Snapdragon XR2 Gen 2.',
    price: 41499,
    category: 'Gaming',
    brand: 'Meta',
    stock: 35,
    images: ['https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500'],
    rating: 4.8,
    numReviews: 423,
    featured: true
  },
  
  {
    name: 'Wacom Cintiq 22 Drawing Tablet',
    description: '22" creative pen display with Full HD screen and Pro Pen 2 with 8,192 pressure levels.',
    price: 99599,
    category: 'Accessories',
    brand: 'Wacom',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500'],
    rating: 4.8,
    numReviews: 167,
    featured: false
  },
  {
    name: 'Rode Wireless GO II',
    description: 'Dual-channel wireless microphone system, perfect for content creators and filmmakers.',
    price: 24999,
    category: 'Accessories',
    brand: 'Rode',
    stock: 32,
    images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500'],
    rating: 4.9,
    numReviews: 234,
    featured: false
  },
  {
    name: 'Synology DS923+ NAS',
    description: '4-bay network attached storage with AMD Ryzen processor, perfect for home and small business.',
    price: 53949,
    category: 'Accessories',
    brand: 'Synology',
    stock: 22,
    images: ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500'],
    rating: 4.8,
    numReviews: 178,
    featured: false
  },
  {
  name: 'Google Nest Cam (Battery)',
  description: 'Wireless smart security camera with intelligent alerts.',
  price: 14939,
  category: 'Smart Home',
  brand: 'Google',
  stock: 45,
  images: ['https://tse2.mm.bing.net/th/id/OIP.JJGlAcj1txi04nehQegPPQHaEK?pid=Api&P=0&h=180'],
  rating: 4.5,
  numReviews: 421,
  featured: false
},
{
  name: 'Ring Video Doorbell Pro 2',
  description: 'Smart doorbell with HD video and motion detection.',
  price: 20749,
  category: 'Smart Home',
  brand: 'Ring',
  stock: 50,
  images: ['https://cdn.shopify.com/s/files/1/0054/9814/2835/products/47711388467230_76c42326-da49-4dce-8755-70c2e8b49950_1600x.jpg?v=1622122263'],
  rating: 4.6,
  numReviews: 689,
  featured: true
},
{
  name: 'Amazon Echo (5th Gen)',
  description: 'Smart speaker with Alexa voice assistant.',
  price: 8299,
  category: 'Smart Home',
  brand: 'Amazon',
  stock: 70,
  images: ['https://tse3.mm.bing.net/th/id/OIP._NsUkCc-t3C1ZhZgWa9XZwHaEK?pid=Api&P=0&h=180'],
  rating: 4.7,
  numReviews: 812,
  featured: false
},
{
  name: 'Philips Hue Starter Kit',
  description: 'Smart lighting kit with customizable color options.',
  price: 16599,
  category: 'Smart Home',
  brand: 'Philips',
  stock: 35,
  images: ['https://m.media-amazon.com/images/I/61kjVP0v1QL._AC_SL1500_.jpg'],
  rating: 4.8,
  numReviews: 378,
  featured: true
},
{
  name: 'TP-Link Kasa Smart Plug',
  description: 'WiFi-enabled smart plug with voice control support.',
  price: 2489,
  category: 'Smart Home',
  brand: 'TP-Link',
  stock: 120,
  images: ['https://media.prod.bunnings.com.au/api/public/content/1cbe5d25de1b4ae3830bdaeb7a1e47ea?v=afee856e'],
  rating: 4.6,
  numReviews: 544,
  featured: false
},
{
  name: 'Eufy RoboVac X8',
  description: 'Smart robotic vacuum with strong suction power.',
  price: 49799,
  category: 'Smart Home',
  brand: 'Eufy',
  stock: 22,
  images: ['https://cdn.mos.cms.futurecdn.net/PLrduZv65yxGRCaKkdWpsY.jpg'],
  rating: 4.5,
  numReviews: 267,
  featured: false
},
{
  name: 'August Wi-Fi Smart Lock',
  description: 'Keyless smart lock with remote access control.',
  price: 19089,
  category: 'Smart Home',
  brand: 'August',
  stock: 30,
  images: ['https://static1.anpoimages.com/wordpress/wp-content/uploads/wm/2024/02/august-wifi-smart-lock-and-sensor.JPEG'],
  rating: 4.4,
  numReviews: 193,
  featured: false
}

 
];

// Import data
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();

    // Insert users
    const createdUsers = await User.insertMany(users);
    // console.log('Users imported!');

    // Insert products
    await Product.insertMany(products);
    // console.log(`${products.length} Products imported!`);

    // console.log('\n✅ Data import complete!');
    // console.log('\n📧 Admin credentials:');
    // console.log('Email: admin@ecommerce.com');
    // console.log('Password: admin123');
    // console.log('\n📧 Test user credentials:');
    // console.log('Email: john@example.com');
    // console.log('Password: password123');
    
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
};

// Destroy data
const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();

    console.log('✅ Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}