const sequelize = require('./config/db');
const Product = require('./models/Product');

async function update() {
  await sequelize.sync();
  
  const p6 = await Product.findOne({ where: { name: 'Pastel Balloon Arch Setup' } });
  if (p6) {
    p6.name = 'Elegant Balloon Decoration';
    await p6.save();
    console.log('Updated Card 6 in DB');
  } else {
    console.log('Card 6 product not found in DB');
  }
}
update();
