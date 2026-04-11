import image5 from '../assets/slider.png/image5.jpeg';
import cake2 from '../assets/slider.png/cake2.jpeg';
import chocalate2 from '../assets/slider.png/chocalate2.jpeg';

export const mockProducts = [
  // Chocolate Bouquets
  { id: 101, name: 'Premium Ferrero Rocher Bouquet', price: '1299.00', category: 'Chocolate Bouquets', image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80' },
  { id: 102, name: 'Dairy Milk Silk Delight Tower', price: '899.00', category: 'Chocolate Bouquets', image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&q=80' },
  { id: 103, name: 'Romantic Lindt Hearts Bouquet', price: '1599.00', category: 'Chocolate Bouquets', image_url: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500&q=80' },
  { id: 104, name: 'Assorted Mixed Chocolate Basket', price: '1100.00', category: 'Chocolate Bouquets', image_url: image5 },
  { id: 105, name: 'Delicious Chocolate Cake', price: '999.00', category: 'Chocolate Bouquets', image_url: cake2 },

  // Birthday Decorations
  { id: 201, name: 'Advocate Theme Special Cake', price: '3499.00', category: 'Birthday Decorations', image_url: 'https://images.unsplash.com/photo-1530103862676-de8892795bf0?w=500&q=80' },
  { id: 202, name: 'Premium Imported Chocolates', price: '1899.00', category: 'Birthday Decorations', image_url: chocalate2 },
  { id: 203, name: 'Gold Foil Confetti Set (50 pcs)', price: '450.00', category: 'Birthday Decorations', image_url: 'https://images.unsplash.com/photo-1543888544-2451ab04fb92?w=500&q=80' },
  { id: 204, name: 'Premium Kids Theme Decor', price: '4999.00', category: 'Birthday Decorations', image_url: 'https://images.unsplash.com/photo-1502631155828-9ba53ecacdf7?w=500&q=80' },
  { id: 205, name: 'Fairy Lights Backdrop', price: '1299.00', category: 'Birthday Decorations', image_url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&q=80' },
  
  // Perfumes
  { id: 301, name: 'Chanel No.5 Perfume', price: '8999.00', category: 'Perfumes', image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80' },
  { id: 302, name: 'Dior Sauvage For Him', price: '9500.00', category: 'Perfumes', image_url: 'https://images.unsplash.com/photo-1523293115678-efa301980be1?w=500&q=80' },
  { id: 303, name: 'Versace Eros Eau de Toilette', price: '7200.00', category: 'Perfumes', image_url: 'https://images.unsplash.com/photo-1593487568720-92097fb460fb?w=500&q=80' },
  { id: 304, name: 'Gucci Bloom Floral Scent', price: '8100.00', category: 'Perfumes', image_url: 'https://images.unsplash.com/photo-1587517904392-49bd651ff206?w=500&q=80' },
  { id: 305, name: 'Tom Ford Oud Wood', price: '12500.00', category: 'Perfumes', image_url: 'https://images.unsplash.com/photo-1615486511484-91acc31aede3?w=500&q=80' },

  // Cakes
  { id: 401, name: 'Red Velvet Anniversary Cake', price: '1199.00', category: 'Cakes', image_url: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500&q=80' },
  { id: 402, name: 'Dark Chocolate Truffle Cake', price: '899.00', category: 'Cakes', image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80' },
  { id: 403, name: 'Fresh Fruits Rainbow Cake', price: '1299.00', category: 'Cakes', image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&q=80' },
  { id: 404, name: 'Vanilla Buttercream Floral Cake', price: '950.00', category: 'Cakes', image_url: 'https://images.unsplash.com/photo-1557308536-ee471ef2c390?w=500&q=80' },
  { id: 405, name: 'Bento Mini Celebration Cake', price: '450.00', category: 'Cakes', image_url: 'https://images.unsplash.com/photo-1606890737305-6afbd8fa225d?w=500&q=80' },

  // Gift Sets
  { id: 501, name: 'Luxury Grooming Gift Set', price: '1499.00', category: 'Gift Sets', image_url: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=500&q=80' },
  { id: 502, name: 'Elegant Watch & Wallet Combo', price: '2100.00', category: 'Gift Sets', image_url: 'https://images.unsplash.com/photo-1549463051-419b5bfb7050?w=500&q=80' },
  { id: 503, name: 'Scented Candles & Spa Gift Set', price: '1250.00', category: 'Gift Sets', image_url: 'https://images.unsplash.com/photo-1608528577891-eb055bfecafa?w=500&q=80' },
  { id: 504, name: 'Personalized Leather Diary Set', price: '899.00', category: 'Gift Sets', image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80' },
  { id: 505, name: 'Premium Tea & Mug Selection', price: '1150.00', category: 'Gift Sets', image_url: 'https://images.unsplash.com/photo-1576208571060-cdbc9c90ae1b?w=500&q=80' },

  // Hampers
  { id: 601, name: 'Assorted Festive Hamper', price: '2499.00', category: 'Hampers', image_url: 'https://images.unsplash.com/photo-1513885055283-bcdd793ac282?w=500&q=80' },
  { id: 602, name: 'Dry Fruits Royal Basket', price: '1899.00', category: 'Hampers', image_url: 'https://images.unsplash.com/photo-1596647363435-09d57a4a9829?w=500&q=80' },
  { id: 603, name: 'Snack & Cravings Mega Box', price: '1450.00', category: 'Hampers', image_url: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500&q=80' },
  { id: 604, name: 'Organic Self-Care Hamper', price: '2100.00', category: 'Hampers', image_url: 'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=500&q=80' },
  { id: 605, name: 'Cheese & Wine Date Hamper', price: '3500.00', category: 'Hampers', image_url: 'https://images.unsplash.com/photo-1505935428862-770b6f24f629?w=500&q=80' },

  // Plants
  { id: 701, name: 'Indoor Snake Plant', price: '699.00', category: 'Plants', image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80' },
  { id: 702, name: 'Lucky Bamboo Glass Vase', price: '450.00', category: 'Plants', image_url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&q=80' },
  { id: 703, name: 'Peace Lily For Desk', price: '550.00', category: 'Plants', image_url: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?w=500&q=80' },
  { id: 704, name: 'Money Plant with Ceramic Pot', price: '399.00', category: 'Plants', image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80' },
  { id: 705, name: 'Ficus Bonsai Tree', price: '1299.00', category: 'Plants', image_url: 'https://images.unsplash.com/photo-1599598425947-3300262b71ab?w=500&q=80' }
];
