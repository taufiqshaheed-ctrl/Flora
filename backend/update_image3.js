const sequelize = require('./config/db');
const Product = require('./models/Product');

async function update() {
  await sequelize.sync();
  const product = await Product.findOne({ where: { name: 'Neon "Happy Birthday" Light' } });
  if (product) {
    product.image_url = 'http://localhost:5000/uploads/chocalate2.jpeg';
    await product.save();
    console.log('Database updated successfully for Neon Light');
  } else {
    console.log('Product not found in DB');
  }
}
update();
