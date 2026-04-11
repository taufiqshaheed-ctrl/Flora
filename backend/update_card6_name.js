const sequelize = require('./config/db');
const Product = require('./models/Product');

async function update() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    
    const p6 = await Product.findOne({ where: { id: 201 } });
    if (p6) {
      p6.name = 'Advocate Theme Special Cake';
      await p6.save();
      console.log('Updated Card 6 (id: 201) name to Advocate Theme Special Cake in DB');
    } else {
      console.log('Product with id: 201 not found in DB');
    }
  } catch (error) {
    console.error('Error updating DB:', error);
  } finally {
    process.exit(0);
  }
}
update();
