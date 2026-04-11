const sequelize = require('./config/db');
const User = require('./models/User');

async function listUsers() {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
      raw: true
    });
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    process.exit(0);
  }
}
listUsers();
