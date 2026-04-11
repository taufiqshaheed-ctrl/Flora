const sequelize = require('./config/db');
const Product = require('./models/Product');

async function list() {
  try {
    const products = await Product.findAll();
    products.forEach(p => {
      console.log(`ID: ${p.id}, Name: ${p.name}`);
    });
  } catch (error) {
    console.error('Error listing products:', error);
  } finally {
    process.exit(0);
  }
}
list();
