const sequelize = require('./config/db');
const Product = require('./models/Product');
async function check() {
  const p = await Product.findOne({ where: { name: 'Assorted Mixed Chocolate Basket' } });
  console.log('Image URL in DB:', p ? p.image_url : 'Product not found');
  process.exit(0);
}
check();
