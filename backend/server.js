require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const Address = require('./models/Address');
const ContactMessage = require('./models/ContactMessage');
const { sendVerificationEmail, sendPasswordResetEmail } = require('./services/emailService');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// --- ENV VALIDATION ---
const REQUIRED_ENV = ['JWT_SECRET', 'MONGO_URI'];
const missingEnv = REQUIRED_ENV.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`FATAL: Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;
const NODE_ENV = process.env.NODE_ENV || 'development';

// --- SECURITY HEADERS ---
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' } // Allow images served cross-origin
}));

// --- COMPRESSION ---
app.use(compression());

// --- LOGGING ---
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// --- CORS ---
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
}));

// --- BODY PARSER ---
app.use(express.json({ limit: '10kb' }));

// --- STATIC UPLOADS ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ENSURE UPLOADS DIR EXISTS ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// --- RATE LIMITERS ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', apiLimiter);

// --- MULTER STORAGE CONFIG ---
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/'),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
  }
});

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, WebP, GIF)'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// --- USER AUTH MIDDLEWARE ---
const userAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// --- ADMIN MIDDLEWARE ---
const adminAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    req.adminId = decoded.id;
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// --- AUTH ROUTES ---

// Register
app.post('/api/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await User.create({
      name, email: email.toLowerCase(), password: hashedPassword,
      verificationToken: verificationOtp, verificationTokenExpiry
    });

    await sendVerificationEmail(email, name, verificationOtp);
    res.status(201).json({ success: true, message: 'OTP sent to your email.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Verify Email OTP
app.post('/api/verify-email', authLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email: email.toLowerCase(),
      verificationToken: otp,
      verificationTokenExpiry: { $gt: new Date() }
    });
    if (!user) return res.status(400).json({ error: 'Invalid or expired OTP.' });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error('Verify email error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Login
app.post('/api/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in. Check your inbox.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Update Profile (requires authentication)
app.put('/api/user/profile', userAuth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (email && email.toLowerCase() !== user.email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) return res.status(400).json({ error: 'Email already in use' });
    }

    user.name = name || user.name;
    user.email = email ? email.toLowerCase() : user.email;
    await user.save();
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change Password (requires authentication)
app.put('/api/user/password', userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both passwords are required' });
    if (newPassword.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Current password incorrect' });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Forgot Password
app.post('/api/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    // Always return success to prevent email enumeration
    if (!user) return res.json({ success: true, message: 'If this email is registered, an OTP has been sent.' });

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetToken = resetOtp;
    user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail(email, user.name, resetOtp);
    res.json({ success: true, message: 'OTP sent to your email.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Reset Password
app.post('/api/reset-password', authLimiter, async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (newPassword?.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const user = await User.findOne({
      email: email?.toLowerCase(),
      resetToken: otp,
      resetTokenExpiry: { $gt: new Date() }
    });
    if (!user) return res.status(400).json({ error: 'Invalid or expired OTP.' });

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful. You can now log in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Reset failed' });
  }
});

// --- ADDRESS ROUTES ---

app.get('/api/addresses/:userId', userAuth, async (req, res) => {
  try {
    // Users can only access their own addresses (admin can access any)
    if (req.userRole !== 'admin' && req.userId !== req.params.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const addresses = await Address.find({ userId: req.params.userId })
      .sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

app.post('/api/addresses', userAuth, async (req, res) => {
  try {
    const { name, phone, address, city, pincode, isDefault } = req.body;
    const userId = req.userId;

    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const newAddress = await Address.create({ userId, name, phone, address, city, pincode, isDefault });
    res.status(201).json(newAddress);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save address' });
  }
});

app.put('/api/addresses/:id', userAuth, async (req, res) => {
  try {
    const { name, phone, address, city, pincode, isDefault } = req.body;
    const addr = await Address.findById(req.params.id);
    if (!addr) return res.status(404).json({ error: 'Address not found' });

    // Ensure user owns this address
    if (req.userRole !== 'admin' && addr.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (isDefault) {
      await Address.updateMany({ userId: addr.userId }, { isDefault: false });
    }

    Object.assign(addr, { name, phone, address, city, pincode, isDefault });
    await addr.save();
    res.json(addr);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update address' });
  }
});

app.delete('/api/addresses/:id', userAuth, async (req, res) => {
  try {
    const addr = await Address.findById(req.params.id);
    if (!addr) return res.status(404).json({ error: 'Address not found' });

    // Ensure user owns this address
    if (req.userRole !== 'admin' && addr.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await Address.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

// --- ORDER ROUTES ---

app.post('/api/orders', userAuth, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
    const userId = req.userId;

    if (!items?.length || !totalAmount || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const order = await Order.create({ userId, items, totalAmount, shippingAddress, paymentMethod });
    res.status(201).json(order);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

app.get('/api/orders/:userId', userAuth, async (req, res) => {
  try {
    if (req.userRole !== 'admin' && req.userId !== req.params.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/admin/orders', adminAuth, async (_req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin orders' });
  }
});

app.put('/api/admin/orders/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('userId', 'name email');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

app.delete('/api/admin/orders/:id', adminAuth, async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// --- CONTACT ROUTES ---

app.post('/api/messages', async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newMessage = await ContactMessage.create({ firstName, lastName, email, message });
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.get('/api/messages', adminAuth, async (_req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.put('/api/messages/:id/read', adminAuth, async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { status: 'read' }, { new: true });
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

app.delete('/api/messages/:id', adminAuth, async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Message not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// --- CATEGORY ROUTES ---

app.get('/api/categories', async (_req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/categories', adminAuth, async (req, res) => {
  try {
    const { name, slug, image } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'Name and slug are required' });
    const existing = await Category.findOne({ slug });
    if (existing) return res.status(400).json({ error: 'Slug already exists' });
    const category = await Category.create({ name, slug, image: image || '' });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.put('/api/categories/:id', adminAuth, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', adminAuth, async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (deleted) res.json({ success: true });
    else res.status(404).json({ error: 'Category not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// --- ADMIN USER MANAGEMENT ---

app.get('/api/admin/users', adminAuth, async (_req, res) => {
  try {
    const users = await User.find()
      .select('-password -verificationToken -resetToken -verificationTokenExpiry -resetTokenExpiry')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.put('/api/admin/users/:id/role', adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
    if (req.params.id === req.adminId.toString()) return res.status(400).json({ error: 'Cannot change your own role' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

app.delete('/api/admin/users/:id', adminAuth, async (req, res) => {
  try {
    if (req.params.id === req.adminId.toString()) return res.status(400).json({ error: 'Cannot delete your own account' });
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// --- PRODUCT ROUTES ---

app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { categoryId: category } : {};
    const products = await Product.find(filter).populate('categoryId');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', adminAuth, async (req, res) => {
  try {
    const { name, price, image_url, categoryId } = req.body;
    if (!name || !price || !image_url) return res.status(400).json({ error: 'Name, price, and image are required' });
    const newProduct = await Product.create({ name, price: parseFloat(price), image_url, categoryId: categoryId || null });
    const savedProduct = await Product.findById(newProduct._id).populate('categoryId');
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', adminAuth, async (req, res) => {
  try {
    const { name, price, image_url, categoryId } = req.body;
    const updateData = { name, price: parseFloat(price), image_url, categoryId: categoryId || null };
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('categoryId');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', adminAuth, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (deleted) res.json({ success: true });
    else res.status(404).json({ error: 'Product not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// --- UPLOAD ROUTE ---

app.post('/api/upload', adminAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image provided' });
  const imageUrl = `${BACKEND_URL}/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// --- GLOBAL ERROR HANDLER ---
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    return res.status(400).json({ error: err.message });
  }

  if (err.message && err.message.includes('Only image files')) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: NODE_ENV === 'production' ? 'Internal server error' : err.message });
});

// --- 404 HANDLER ---
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// --- START SERVER ---
let server;
connectDB().then(() => {
  server = app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

// --- GRACEFUL SHUTDOWN ---
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('Forced shutdown after timeout.');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
