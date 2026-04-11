const sequelize = require('./config/db');
const Product = require('./models/Product');

async function update() {
  await sequelize.sync();
  const product = await Product.findOne({ where: { name: 'Assorted Mixed Chocolate Basket' } });
  if (product) {
    product.image_url = 'http://localhost:5000/uploads/image5.jpeg';
    await product.save();
    console.log('Database updated successfully');
  } else {
    console.log('Product not found in DB');
  }
}
update();
