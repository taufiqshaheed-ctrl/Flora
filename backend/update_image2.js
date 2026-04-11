const sequelize = require('./config/db');
const Product = require('./models/Product');

async function update() {
  await sequelize.sync();
  const product = await Product.findOne({ where: { name: 'Gourmet Dark Choco Arrangement' } });
  if (product) {
    product.image_url = 'http://localhost:5000/uploads/cake2.jpeg';
    await product.save();
    console.log('Database updated successfully for Gourmet Dark Choco Arrangement');
  } else {
    console.log('Product not found in DB');
  }
}
update();
