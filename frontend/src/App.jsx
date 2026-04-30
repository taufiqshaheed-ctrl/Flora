import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Delivery from './pages/Delivery';
import Contact from './pages/Contact';
import PaymentDelivery from './pages/PaymentDelivery';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import UserDashboard from './pages/UserDashboard';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import About from './pages/About';
import Categories from './pages/Categories';
import CategoryProducts from './pages/CategoryProducts';
import ProductDetail from './pages/ProductDetail';
import FAQ from './pages/FAQ';
import Returns from './pages/Returns';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Footer from './components/Footer';
import ProtectedRoute, { GuestRoute } from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import WishlistPage from './pages/WishlistPage';

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
      <OrderProvider>
        <CartProvider>
        <Router>
          <div className="font-sans text-gray-900 min-h-screen flex flex-col selection:bg-[#fbbf24] selection:text-gray-900">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/payment-delivery" element={<PaymentDelivery />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:blogId" element={<BlogDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
                <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
                <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/category/:categoryName" element={<CategoryProducts />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                
                <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />

                {/* Protected Routes */}
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
                <Route path="/admin-login" element={<AdminLogin />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </OrderProvider>
    </WishlistProvider>
    </AuthProvider>
  );
}


export default App;
