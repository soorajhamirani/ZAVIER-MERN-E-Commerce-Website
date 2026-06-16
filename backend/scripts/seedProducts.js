require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/finery');
    console.log('MongoDB Connected for ZAVIER™ 20 Products Seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing Users, Products, and Orders.');

    // Seed default users
    const adminUser = new User({
      name: 'Zavier Admin',
      email: 'admin@finery.com',
      password: 'admin123password',
      role: 'admin'
    });
    await adminUser.save();

    const customerUser = new User({
      name: '',
      email: '',
      password: '',
      role: 'customer'
    });
    await customerUser.save();

    console.log('Seeded Users (Admin: admin@finery.com, Customer: customer@finery.com)');

    // Seed 20 traditional Pakistani garments in PKR
    const products = [
      {
        title: 'Mens Premium Linen Shalwar Kameez',
        description: 'Luxurious double-ply linen fabric stitched to perfection. Features a clean band collar, double-button cuffs, and classic tailored fitting. Ideal for winter gatherings.',
        price: 4800,
        categories: ['menswear', 'winter collection', 'new arrivals'],
        gender: 'Mens',
        season: 'Winter',
        images: ['/images/mens_shalwar.jpg'],
        variants: [
          { size: 'S (38)', color: 'Charcoal Black', stockCount: 15 },
          { size: 'M (40)', color: 'Charcoal Black', stockCount: 20 },
          { size: 'L (42)', color: 'Charcoal Black', stockCount: 12 },
          { size: 'XL (44)', color: 'Charcoal Black', stockCount: 8 }
        ]
      },
      {
        title: 'Womens Embroidered Lawn Kurti',
        description: 'Delicate digital print lawn shirt with sophisticated hand-embroidered neckline. Soft pastel colors ideal for daily summer wear and casual modesty.',
        price: 3500,
        categories: ['womenswear', 'summer essentials', 'edit'],
        gender: 'Womens',
        season: 'Summer',
        images: ['/images/womens_kurti.jpg'],
        variants: [
          { size: 'S (36)', color: 'Ivory', stockCount: 18 },
          { size: 'M (38)', color: 'Ivory', stockCount: 25 },
          { size: 'L (40)', color: 'Ivory', stockCount: 15 },
          { size: 'XL (42)', color: 'Ivory', stockCount: 10 }
        ]
      },
      {
        title: 'Kids Cotton Kurta Pajama Suit',
        description: 'Pure premium cotton fabric styled with intricate geometric embroidery. Breathable, comfortable, and elegant for Eid and festive occasions.',
        price: 2200,
        categories: ['childrenswear', 'summer essentials'],
        gender: 'Childrens',
        season: 'Summer',
        images: ['/images/kids_kurta.jpg'],
        variants: [
          { size: '24', color: 'Soft Cream', stockCount: 10 },
          { size: '26', color: 'Soft Cream', stockCount: 15 },
          { size: '28', color: 'Soft Cream', stockCount: 12 },
          { size: '30', color: 'Soft Cream', stockCount: 5 }
        ]
      },
      {
        title: 'Womens Pashmina Shawl Suit',
        description: 'Warm, hand-woven Pashmina shawl paired with a premium woolen unstitched shirt and trouser set. Elaborate classical prints.',
        price: 8500,
        categories: ['womenswear', 'winter collection', 'edit'],
        gender: 'Womens',
        season: 'Winter',
        images: ['/images/womens_shawl.jpg'],
        variants: [
          { size: 'S (36)', color: 'Ruby Crimson', stockCount: 8 },
          { size: 'M (38)', color: 'Ruby Crimson', stockCount: 12 },
          { size: 'L (40)', color: 'Ruby Crimson', stockCount: 8 },
          { size: 'XL (42)', color: 'Ruby Crimson', stockCount: 4 }
        ]
      },
      {
        title: 'Tailored Velvet Sherwani Coat',
        description: 'Royal structured velvet sherwani coat, perfect for formal occasions. Detailed with custom metal buttons and elegant thread lining.',
        price: 15000,
        categories: ['menswear', 'winter collection', 'new arrivals', 'edit'],
        gender: 'Mens',
        season: 'Winter',
        images: ['/images/mens_sherwani.jpg'],
        variants: [
          { size: 'S (38)', color: 'Royal Black', stockCount: 15 },
          { size: 'M (40)', color: 'Royal Black', stockCount: 22 },
          { size: 'L (42)', color: 'Royal Black', stockCount: 18 },
          { size: 'XL (44)', color: 'Royal Black', stockCount: 12 }
        ]
      },
      {
        title: 'Mens Casual Khaddar Kurta',
        description: 'Stark charcoal hand-loomed khaddar kurta, built for a relaxed fit and long-term durability. Complete with traditional wooden buttons.',
        price: 3800,
        categories: ['menswear', 'summer essentials'],
        gender: 'Mens',
        season: 'Summer',
        images: ['/images/mens_khaddar.jpg'],
        variants: [
          { size: 'S (38)', color: 'Slate Grey', stockCount: 10 },
          { size: 'M (40)', color: 'Slate Grey', stockCount: 15 },
          { size: 'L (42)', color: 'Slate Grey', stockCount: 12 },
          { size: 'XL (44)', color: 'Slate Grey', stockCount: 8 }
        ]
      },
      {
        title: 'Womens Silk Anarkali Suit',
        description: 'Magnificent flowy silk Anarkali dress paired with custom embroidered borders and a sheer organza dupatta. Rich traditional festive attire.',
        price: 11500,
        categories: ['womenswear', 'summer essentials', 'new arrivals'],
        gender: 'Womens',
        season: 'Summer',
        images: ['/images/womens_anarkali.jpg'],
        variants: [
          { size: 'S (36)', color: 'Olive Gold', stockCount: 12 },
          { size: 'M (38)', color: 'Olive Gold', stockCount: 15 },
          { size: 'L (40)', color: 'Olive Gold', stockCount: 10 },
          { size: 'XL (42)', color: 'Olive Gold', stockCount: 5 }
        ]
      },
      {
        title: 'Mens Designer Silk Kurta',
        description: 'Premium raw silk kurta detailed with micro-pin tuck pleats and custom buttons. A perfect dressy selection for weddings.',
        price: 4500,
        categories: ['menswear', 'summer essentials', 'edit'],
        gender: 'Mens',
        season: 'Summer',
        images: ['/images/mens_designer_kurta.jpg'],
        variants: [
          { size: 'S (38)', color: 'Teal Green', stockCount: 10 },
          { size: 'M (40)', color: 'Teal Green', stockCount: 12 },
          { size: 'L (42)', color: 'Teal Green', stockCount: 15 },
          { size: 'XL (44)', color: 'Teal Green', stockCount: 8 }
        ]
      },
      {
        title: 'Kids Pashmina Waistcoat Set',
        description: 'Miniature wool blend pashmina waistcoat combined with a soft cotton kurta pajama set. Elegant ethnic design for winter.',
        price: 3200,
        categories: ['childrenswear', 'winter collection'],
        gender: 'Childrens',
        season: 'Winter',
        images: ['/images/kids_vest.jpg'],
        variants: [
          { size: '24', color: 'Crimson', stockCount: 8 },
          { size: '26', color: 'Crimson', stockCount: 10 },
          { size: '28', color: 'Crimson', stockCount: 8 },
          { size: '30', color: 'Crimson', stockCount: 4 }
        ]
      },
      {
        title: 'Womens Velvet Kaftan Dress',
        description: 'Sumptuous micro-velvet draped kaftan with intricate gold tilla embroidery along the neck and borders. Warm and majestic.',
        price: 13000,
        categories: ['womenswear', 'winter collection', 'new arrivals'],
        gender: 'Womens',
        season: 'Winter',
        images: ['/images/womens_kaftan.jpg'],
        variants: [
          { size: 'S (36)', color: 'Plum Purple', stockCount: 10 },
          { size: 'M (38)', color: 'Plum Purple', stockCount: 15 },
          { size: 'L (40)', color: 'Plum Purple', stockCount: 10 },
          { size: 'XL (42)', color: 'Plum Purple', stockCount: 6 }
        ]
      },
      {
        title: 'Mens Wash & Wear Basic Suit',
        description: 'Wrinkle-resistant wash & wear fabric stitched for everyday office comfort. Tailored collar fit and standard matching salwar.',
        price: 3200,
        categories: ['menswear', 'summer essentials'],
        gender: 'Mens',
        season: 'Summer',
        images: ['/images/mens_washwear.jpg'],
        variants: [
          { size: 'S (38)', color: 'Steel Grey', stockCount: 20 },
          { size: 'M (40)', color: 'Steel Grey', stockCount: 25 },
          { size: 'L (42)', color: 'Steel Grey', stockCount: 20 },
          { size: 'XL (44)', color: 'Steel Grey', stockCount: 15 }
        ]
      },
      {
        title: 'Kids Festive Lehenga Choli Set',
        description: 'Charming micro-velvet lehenga with digital floral motifs and a matching silk dupatta. A beautiful look for winter weddings.',
        price: 6800,
        categories: ['childrenswear', 'winter collection', 'edit'],
        gender: 'Childrens',
        season: 'Winter',
        images: ['/images/kids_lehenga.jpg'],
        variants: [
          { size: '24', color: 'Rose Pink', stockCount: 6 },
          { size: '26', color: 'Rose Pink', stockCount: 10 },
          { size: '28', color: 'Rose Pink', stockCount: 8 },
          { size: '30', color: 'Rose Pink', stockCount: 4 }
        ]
      },
      {
        title: 'Stitched Cotton Shalwar Kameez',
        description: 'Traditional Pakistani wash and wear soft cotton salwar suit set. Detailed cuff cuffs, soft shirt fall, and comfort salwar fit.',
        price: 4200,
        categories: ['menswear', 'summer essentials', 'new arrivals'],
        gender: 'Mens',
        season: 'Summer',
        images: ['/images/mens_cotton_sk.jpg'],
        variants: [
          { size: 'S (38)', color: 'Ivory White', stockCount: 15 },
          { size: 'M (40)', color: 'Ivory White', stockCount: 20 },
          { size: 'L (42)', color: 'Ivory White', stockCount: 15 },
          { size: 'XL (44)', color: 'Ivory White', stockCount: 8 }
        ]
      },
      {
        title: 'Kids Festive Waistcoat Set',
        description: 'Elegant children ethnic silk waistcoat paired with soft linen white pajama kurta. Features hand-crafted loops and buttons.',
        price: 2900,
        categories: ['childrenswear', 'winter collection', 'new arrivals'],
        gender: 'Childrens',
        season: 'Winter',
        images: ['/images/kids_festive.jpg'],
        variants: [
          { size: '24', color: 'Navy Blue', stockCount: 12 },
          { size: '26', color: 'Navy Blue', stockCount: 15 },
          { size: '28', color: 'Navy Blue', stockCount: 10 },
          { size: '30', color: 'Navy Blue', stockCount: 6 }
        ]
      },
      {
        title: 'Premium Linen Kurta',
        description: 'Casual comfort linen kurta detailed with classical embroidery. Very durable and breathable for Pakistani transitional seasons.',
        price: 3600,
        categories: ['menswear', 'winter collection', 'edit'],
        gender: 'Mens',
        season: 'Winter',
        images: ['/images/mens_linen_kurta.jpg'],
        variants: [
          { size: 'S (38)', color: 'Forest Green', stockCount: 10 },
          { size: 'M (40)', color: 'Forest Green', stockCount: 12 },
          { size: 'L (42)', color: 'Forest Green', stockCount: 15 },
          { size: 'XL (44)', color: 'Forest Green', stockCount: 8 }
        ]
      },
      {
        title: 'Embroidered Silk Shawl',
        description: 'Exquisite silk blend winter wrap shawl detailed with traditional floral border thread embroidery. Majestic wrap for bridal setups.',
        price: 6800,
        categories: ['womenswear', 'winter collection', 'new arrivals', 'edit'],
        gender: 'Womens',
        season: 'Winter',
        images: ['/images/womens_silk_shawl.jpg'],
        variants: [
          { size: 'S (36)', color: 'Deep Maroon', stockCount: 8 },
          { size: 'M (38)', color: 'Deep Maroon', stockCount: 10 },
          { size: 'L (40)', color: 'Deep Maroon', stockCount: 12 },
          { size: 'XL (42)', color: 'Deep Maroon', stockCount: 5 }
        ]
      },
      {
        title: 'Stitched Karandi Shirt',
        description: 'Stark and textured Karandi shirt tailored with modern loop collar styling and elegant side panels. Extremely warm fabric.',
        price: 4500,
        categories: ['womenswear', 'winter collection'],
        gender: 'Womens',
        season: 'Winter',
        images: ['/images/womens_karandi.jpg'],
        variants: [
          { size: 'S (36)', color: 'Rust Orange', stockCount: 12 },
          { size: 'M (38)', color: 'Rust Orange', stockCount: 15 },
          { size: 'L (40)', color: 'Rust Orange', stockCount: 10 },
          { size: 'XL (42)', color: 'Rust Orange', stockCount: 8 }
        ]
      },
      {
        title: 'Kids Embroidered Lehenga',
        description: 'Festive digital print lawn lehenga paired with a small solid choli and chiffon sheer wrap. Perfect for summer weddings.',
        price: 5500,
        categories: ['childrenswear', 'summer essentials', 'edit'],
        gender: 'Childrens',
        season: 'Summer',
        images: ['/images/kids_emb_lehenga.jpg'],
        variants: [
          { size: '24', color: 'Mustard Yellow', stockCount: 10 },
          { size: '26', color: 'Mustard Yellow', stockCount: 12 },
          { size: '28', color: 'Mustard Yellow', stockCount: 10 },
          { size: '30', color: 'Mustard Yellow', stockCount: 5 }
        ]
      },
      {
        title: 'Cotton Jacobite Kurta',
        description: 'Relaxed cotton lawn Jacobite lace collar kurta, customized with traditional wood toggles. Light and easy for summers.',
        price: 3400,
        categories: ['menswear', 'summer essentials'],
        gender: 'Mens',
        season: 'Summer',
        images: ['/images/mens_jacobite.jpg'],
        variants: [
          { size: 'S (38)', color: 'Cream Khaki', stockCount: 15 },
          { size: 'M (40)', color: 'Cream Khaki', stockCount: 18 },
          { size: 'L (42)', color: 'Cream Khaki', stockCount: 12 },
          { size: 'XL (44)', color: 'Cream Khaki', stockCount: 8 }
        ]
      },
      {
        title: 'Womens Printed Chiffon Dupatta',
        description: 'Lightweight flowy printed chiffon dupatta, featuring classical ethnic motifs along borders. Easily matches traditional lawn sets.',
        price: 1800,
        categories: ['womenswear', 'summer essentials', 'new arrivals'],
        gender: 'Womens',
        season: 'Summer',
        images: ['/images/womens_chiffon.jpg'],
        variants: [
          { size: 'S (36)', color: 'Floral Crimson', stockCount: 20 },
          { size: 'M (38)', color: 'Floral Crimson', stockCount: 25 },
          { size: 'L (40)', color: 'Floral Crimson', stockCount: 20 },
          { size: 'XL (42)', color: 'Floral Crimson', stockCount: 15 }
        ]
      }
    ];

    const seededProducts = await Product.insertMany(products);
    console.log('Seeded ZAVIER™ localized products successfully!');

    // Seed mock transactions (Orders) with Pakistan Sizing
    const mockOrders = [
      {
        user: customerUser._id,
        items: [
          {
            product: seededProducts[0]._id,
            size: 'M (40)',
            color: 'Charcoal Black',
            price: seededProducts[0].price,
            quantity: 1
          },
          {
            product: seededProducts[1]._id,
            size: 'S (36)',
            color: 'Ivory',
            price: seededProducts[1].price,
            quantity: 2
          }
        ],
        totalAmount: (seededProducts[0].price * 1) + (seededProducts[1].price * 2),
        shippingAddress: {
          name: 'Sooraj Hamirani',
          street: 'Block 4, Gulshan-e-Iqbal',
          city: 'Karachi',
          postalCode: '75300',
          country: 'Pakistan'
        },
        paymentStatus: 'paid',
        stripePaymentIntentId: 'mock_stripe_intent_seeder_1',
        fulfillmentStatus: 'Processing',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        user: customerUser._id,
        items: [
          {
            product: seededProducts[4]._id,
            size: 'M (40)',
            color: 'Royal Black',
            price: seededProducts[4].price,
            quantity: 1
          }
        ],
        totalAmount: seededProducts[4].price,
        shippingAddress: {
          name: 'Sooraj Hamirani',
          street: 'Phase 6, DHA',
          city: 'Lahore',
          postalCode: '54000',
          country: 'Pakistan'
        },
        paymentStatus: 'paid',
        stripePaymentIntentId: 'mock_stripe_intent_seeder_2',
        fulfillmentStatus: 'Delivered',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    await Order.insertMany(mockOrders);
    console.log('Seeded ZAVIER™ mock transactions successfully!');

    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
