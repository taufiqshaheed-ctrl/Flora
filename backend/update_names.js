const sequelize = require('./config/db');
const Product = require('./models/Product');

async function update() {
  await sequelize.sync();
  
  const p5 = await Product.findOne({ where: { name: 'Gourmet Dark Choco Arrangement' } });
  if (p5) {
    p5.name = 'Delicious Chocolate Cake';
    await p5.save();
    console.log('Updated Card 5 in DB');
  }

  const p7 = await Product.findOne({ where: { name: 'Neon "Happy Birthday" Light' } });
  if (p7) {
    p7.name = 'Premium Imported Chocolates';
    await p7.save();
    console.log('Updated Card 7 in DB');
  }
}
update();
