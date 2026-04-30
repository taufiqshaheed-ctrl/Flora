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
const Wishlist = require('./models/Wishlist');
const PageContent = require('./models/PageContent');
const Pincode = require('./models/Pincode');
const Blog = require('./models/Blog');
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

// --- TRUST PROXY (required for correct IP detection behind nginx/load balancers) ---
app.set('trust proxy', 1);

// --- SECURITY HEADERS ---
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // managed separately; don't let helmet block image loads
}));

// --- COMPRESSION ---
app.use(compression());

// --- LOGGING ---
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// --- CORS ---
// Normalize origin: strip trailing slash, lowercase protocol for comparison
const normalizeOrigin = (o) => (o || '').replace(/\/$/, '').toLowerCase();
const ALLOWED_ORIGINS = [
  FRONTEND_URL,
  ...(process.env.ADDITIONAL_ORIGINS || '').split(',').filter(Boolean),
].map(normalizeOrigin);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, server-to-server, curl)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(normalizeOrigin(origin))) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Explicit preflight for all routes
app.options('*', cors());

// --- BODY PARSER ---
// Increased to 10mb — blog HTML content can exceed the old 10kb limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
// Covers: JPEG/JPG (standard + non-standard mime), PNG, WebP, GIF
// HEIC/HEIF (iPhone native), BMP, TIFF — mobile phones send these
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg', 'image/jpg', 'image/pjpeg',
  'image/png',  'image/x-png',
  'image/webp',
  'image/gif',
  'image/heic', 'image/heif',           // iPhone camera photos
  'image/bmp',  'image/x-bmp',
  'image/tiff', 'image/x-tiff',
]);

// Also validate by file extension as a secondary guard
const ALLOWED_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.gif',
  '.heic', '.heif', '.bmp', '.tiff', '.tif',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/'),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, 'img-' + uniqueSuffix + ext);
  }
});

const fileFilter = (_req, file, cb) => {
  const mime = (file.mimetype || '').toLowerCase();
  const ext  = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_IMAGE_TYPES.has(mime) || ALLOWED_EXTENSIONS.has(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Upload a JPEG, PNG, WebP, or GIF image. (received: ${mime})`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB — covers high-res phone photos
    files: 1,
  },
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

// --- BLOG ROUTES ---

const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ publishedAt: -1 });
    res.json(blogs);
  } catch { res.status(500).json({ error: 'Failed to fetch blogs' }); }
});

app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch { res.status(500).json({ error: 'Failed to fetch blog' }); }
});

app.post('/api/blogs', adminAuth, async (req, res) => {
  try {
    const { title, excerpt, content, image_url, publishedAt, h1, metaTitle, metaKeywords, metaDescription, contentImages } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    let slug = slugify(title);
    const existing = await Blog.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;
    const blog = await Blog.create({ title, slug, excerpt, content, image_url, publishedAt: publishedAt || new Date(), h1, metaTitle, metaKeywords, metaDescription, contentImages: contentImages || [] });
    res.status(201).json(blog);
  } catch { res.status(500).json({ error: 'Failed to create blog' }); }
});

app.put('/api/blogs/:id', adminAuth, async (req, res) => {
  try {
    const { title, excerpt, content, image_url, publishedAt, h1, metaTitle, metaKeywords, metaDescription, contentImages } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, excerpt, content, image_url, publishedAt, h1, metaTitle, metaKeywords, metaDescription, contentImages },
      { new: true }
    );
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch { res.status(500).json({ error: 'Failed to update blog' }); }
});

app.delete('/api/blogs/:id', adminAuth, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Failed to delete blog' }); }
});

// --- PAGE CONTENT ROUTES ---

const DEFAULT_CARE_GUIDE = `<h2>How are Bonsai Plants cared for?</h2>
<p>The Japanese practise of "Tray planting," or bonsai, has been practised for thousands of years and is still popular among gardeners today. The art of bonsai involves synchronising the shape, texture, and colour of the tree with the pot to create a seamless whole. Present-day bonsai trees come in a wide variety.</p>
<p>Proper watering is part of bonsai tree maintenance. Your Bonsai should be submerged in water once a week until the bubbles cease rising to the surface. Avoid using excessive water pressure. Don't only water the soil because the bonsai plant's entire body absorbs water to some extent. If your Bonsai flourishes better outdoors, pick a spot that provides six or more hours of sunlight. Indoor Bonsai need two to four hours of natural sunlight or artificial light.</p>
<p>Regular tree shaping is required. Any branches that obstruct the desired style should be cut off. Then, prune to reroute growth. Branch pruning is often done in the spring, when much of the new growth is removed.</p>
<h2>How are Terrarium Plants cared for?</h2>
<ul><li>First, choose a suitable location for your terrarium!</li><li>Depending on the situation, water sparingly only until the soil becomes dry every 1-2 weeks. Do not overwater! The secret is to carefully observe your terrarium until you comprehend its drying routine. For plants, overwatering can be more harmful than under watering.</li><li>Put indoors in a bright area; some direct sunlight is acceptable.</li><li>Pinch off the most recent growth when the plants reach the desired size to promote bushier growth.</li><li>Since leaves rot fast, avoid watering the leaves and instead water the base of the plants.</li><li>Delight in your terrarium.</li></ul>
<h2>How should indoor plants be cared for?</h2>
<p>Any house decor can benefit greatly from plants. Your health will benefit from them as well. These recommendations from Floraladda will help your houseplants thrive.</p>
<ul><li>Keep plants away from direct sunshine and in areas with moderate lighting. Although natural light is preferable, certain plants can also flourish in fluorescent office lighting.</li><li>Plant soil should always be maintained moist. Be cautious not to overwater. Plants shouldn't be allowed to stand in water.</li><li>Refrain from over wetting plant leaves. In the case of flowering plants, a water spray should be helpful.</li><li>For optimal function, the plant should be kept in a cool area (between 18 and 28 °C).</li><li>Sometimes remove dead leaves and stems.</li></ul>
<h2>How is Lucky Bamboo cared for?</h2>
<ul><li>The optimal light for a lucky bamboo plant is indirect light at a moderate intensity.</li><li>Two or three times every week, give your bamboo plant some new, clean water. Maintaining several inches of water in the container is essential to keep the plant's roots moist.</li><li>Your lucky bamboo is kept in prime condition by changing the water every 7 to 10 days.</li></ul>
<h2>How do you prolong the freshness of your cut flowers?</h2>
<p>Floraladda knows that giving flowers is a sentimental gesture, so we go above and above to give you only the finest blooms. Although delicate, flowers can be enjoyed for 3–4 days with the proper care.</p>
<p>Every morning, we take great care to select the greatest flowers, and we make sure they are properly hydrated and packaged with the highest care before they arrive at your door.</p>
<ul><li>Flowers can be sent in bud, semi-blossomed, or fully bloomed stages.</li><li>If your flowers are sent in a bunch, take the packaging off so they can breathe. Place them in a vase filled with sterile water. Each flower stem should have about 2 cm cut from the bottom, and any leaves that are below the waterline should be removed.</li><li>Attend to the needs of the flowers' food and water. Fill the flower vase with room temperature water and the appropriate amount of flower food (if available).</li><li>Make sure that there isn't any dirt, trash, or other unpleasant materials in the water, such as dried-up leaves or stem fragments, as bacterial growth might significantly shorten the flower's lifespan.</li><li>If your flowers are sent in an arrangement shape fastened to floral foam, all you need to do is make sure the foam is kept moist throughout the day by pouring water over it. You don't need to clip the stems when making an arrangement.</li><li>Keep flowers away from direct sunlight, air vents, direct fan draughts, and the tops of radiators or televisions. They may speed up the drying and wilting of the blooms.</li><li>Love the blooms!</li></ul>
<h2>Rose Plant Maintenance Advice</h2>
<p>The "Queen of Flowers" is another name for Rose. The truth is that you may cultivate rose shrubs like any other type of plant and enjoy the splendour of their full bloom.</p>
<h3>Essential Advice for a Healthy Rose Bloom</h3>
<ul><li>Begin with container roses if you are just starting. They are quite simple to plant in the ground and available in high-quality nurseries.</li><li>Avoid attempting to grow too many types at once — several varieties are incompatible and can negatively affect one another's health.</li><li>Rose bushes must receive direct sunshine for an uninterrupted eight hours. Roses grow best in sandy soil that has good drainage.</li><li>The optimum time to grow roses is in the spring or early autumn, giving roots time to establish before winter.</li><li>Regularly watering the rose gardens is necessary to maintain a healthy yield.</li><li>Modern rose breeds have been bred to be more resilient than earlier varieties and can be cultivated without much difficulty.</li></ul>
<h2>Orchid Care Advice</h2>
<p>Tropical flowers called orchids come in a wide spectrum of hues. One of the most exquisite flower species, orchids have stunning blossoms with vivid colours and can also be grown inside in containers.</p>
<h3>How to Grow Healthy Orchids</h3>
<ul><li>Gently water them. It is not necessary to water orchids frequently — depending on the type, water once every 5 or 12 days.</li><li>Use specific fertilisers for orchids only. Do not fertilise with substances intended for other plants.</li><li>Sunlight is crucial but do not overexpose. The area next to the window is ideal. Draw a curtain on particularly sunny afternoons.</li><li>Healthy orchid plants will have leaves that are a pale green tint. Dark green means insufficient sunshine; a touch of crimson means overexposure.</li><li>Cut non-blooming stems to encourage new growth, and provide balanced water, sunlight, and fertilisers.</li><li>Each type of orchid is unique and needs a distinct type of care. Research your specific variety.</li><li>Place in well-drained soil and repot within two years. Keep an eye out for diseases and pests.</li></ul>
<h2>Handling, Transporting, and Storing Cakes</h2>
<p>If cakes are not kept properly after delivery, they may spoil quickly. Here is advice on how to take better care of a cake.</p>
<h3>Care advice (when delivered):</h3>
<ul><li>Keep fresh fruit cakes, cream cheese cakes with pastry cream, and lemon curd in the refrigerator if not going to be eaten right away.</li><li>Avoid placing your cake in direct sunlight; keep it in an air-conditioned space.</li><li>If your cake has figures or sculptures supported by toothpicks, wooden skewers, or wire, let others know before serving young children.</li><li>Manually painted and airbrushed cakes should not be refrigerated — moisture will cause food colorings to run.</li><li>Daylight and fluorescent lighting might make pink and purple cake decorations look less vibrant.</li></ul>
<h3>Care advice (when collecting from the shop):</h3>
<ul><li>Double-check the cake name, special messages, cream colour, and spelling.</li><li>Keep both hands under the board when leaving so weight is evenly distributed — layers can crack otherwise.</li><li>Do not squeeze the cake box sides.</li><li>Use a car or auto rather than a bicycle, bus, or train — you need room for the cake box.</li><li>Place the cake on the flattest area of your vehicle — a flat bed in an SUV or the floorboard is best.</li><li>Keep nothing close to the cake box for safety.</li><li>Avoid other errands when transporting a designer cake; deliver it right away.</li></ul>
<h2>Cream Cake Care</h2>
<ul><li>Refrigerate immediately upon receipt.</li><li>Cakes taste best at room temperature — allow to warm before serving.</li><li>Consume within 24 hours of refrigerating.</li><li>Drive with air conditioning; keep temperature below 16–18 °C during transport.</li><li>Pink and purple decorations may disintegrate under daylight or fluorescent lighting.</li></ul>
<h2>Fondant Cake Care</h2>
<ul><li>Keep fondant cakes in an air-conditioned space at 16–18 °C.</li><li>Cakes taste best at room temperature — allow to warm before serving.</li><li>Use a serrated knife when slicing a fondant cake.</li><li>Consume within one day.</li><li>Drive with air conditioning and stay below 16–18 °C during transport.</li><li>Pink and purple decorations may disintegrate under daylight or fluorescent lighting.</li></ul>`;

app.get('/api/content/:key', async (req, res) => {
  try {
    let doc = await PageContent.findOne({ key: req.params.key });
    if (!doc) {
      const defaults = { 'care-guide': { title: 'Care Guide', content: DEFAULT_CARE_GUIDE } };
      const def = defaults[req.params.key];
      if (def) {
        doc = await PageContent.create({ key: req.params.key, ...def });
      } else {
        return res.status(404).json({ error: 'Content not found' });
      }
    }
    res.json(doc);
  } catch {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

app.put('/api/content/:key', adminAuth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const doc = await PageContent.findOneAndUpdate(
      { key: req.params.key },
      { title, content },
      { upsert: true, new: true }
    );
    res.json(doc);
  } catch {
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// --- PINCODE ROUTES ---

app.get('/api/pincodes', async (req, res) => {
  try {
    const pincodes = await Pincode.find().sort({ code: 1 });
    res.json(pincodes);
  } catch { res.status(500).json({ error: 'Failed to fetch pincodes' }); }
});

app.get('/api/pincodes/check/:code', async (req, res) => {
  try {
    const pin = await Pincode.findOne({ code: req.params.code.trim() });
    res.json({ deliverable: !!pin, area: pin?.area || '' });
  } catch { res.status(500).json({ error: 'Failed to check pincode' }); }
});

app.post('/api/pincodes', adminAuth, async (req, res) => {
  try {
    const { code, area } = req.body;
    if (!code) return res.status(400).json({ error: 'Pincode is required' });
    const pin = await Pincode.findOneAndUpdate(
      { code: code.trim() },
      { code: code.trim(), area: area || '' },
      { upsert: true, new: true }
    );
    res.status(201).json(pin);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Pincode already exists' });
    res.status(500).json({ error: 'Failed to add pincode' });
  }
});

app.delete('/api/pincodes/:id', adminAuth, async (req, res) => {
  try {
    await Pincode.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Failed to delete pincode' }); }
});

// --- WISHLIST ROUTES ---

app.get('/api/wishlist', userAuth, async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.userId }).populate('productId');
    res.json(items.map(i => i.productId).filter(Boolean));
  } catch {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

app.post('/api/wishlist/:productId', userAuth, async (req, res) => {
  try {
    await Wishlist.findOneAndUpdate(
      { userId: req.userId, productId: req.params.productId },
      { userId: req.userId, productId: req.params.productId },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

app.delete('/api/wishlist/:productId', userAuth, async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ userId: req.userId, productId: req.params.productId });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to remove from wishlist' });
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

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/products', adminAuth, async (req, res) => {
  try {
    const { name, price, originalPrice, description, image_url, categoryId } = req.body;
    if (!name || !price || !image_url) return res.status(400).json({ error: 'Name, price, and image are required' });
    const newProduct = await Product.create({
      name, price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      description: description || '',
      image_url, categoryId: categoryId || null
    });
    const savedProduct = await Product.findById(newProduct._id).populate('categoryId');
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', adminAuth, async (req, res) => {
  try {
    const { name, price, originalPrice, description, image_url, categoryId } = req.body;
    const updateData = {
      name, price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      description: description || '',
      image_url, categoryId: categoryId || null
    };
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

app.post('/api/upload', adminAuth, (req, res) => {
  // Run multer manually so we can return a clean JSON error (not an HTML 500)
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 10 MB.' });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ error: 'Unexpected field. Use field name "image".' });
      }
      return res.status(400).json({ error: err.message || 'Upload failed.' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No image file received. Make sure the field name is "image".' });
    }
    const imageUrl = `${BACKEND_URL}/uploads/${req.file.filename}`;
    res.json({ url: imageUrl, filename: req.file.filename, size: req.file.size });
  });
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
