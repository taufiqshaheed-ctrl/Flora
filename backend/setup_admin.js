const sequelize = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function setupAdmin() {
  try {
    const email = 'muskanmuz@123gmail.com';
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        name: 'Admin',
        password: hashedPassword,
        role: 'admin'
      }
    });

    if (!created) {
      await user.update({
        role: 'admin',
        password: hashedPassword
      });
      console.log(`User ${email} updated to Admin role and password set to 'admin123'.`);
    } else {
      console.log(`Admin user created with email ${email} and password 'admin123'.`);
    }

  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    process.exit(0);
  }
}

setupAdmin();
