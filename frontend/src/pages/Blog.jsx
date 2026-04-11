import React from 'react';
import BlogCard from '../components/BlogCard';

/**
 * Blog Page Component
 * Displays the hero section, the list of blog posts using BlogCard, and the newsletter section.
 */
const Blog = () => {
  const blogs = [
    {
      id: 1,
      title: "Top 5 Surprise Birthday Ideas on a Budget 🎈",
      category: "Party Planning",
      date: "Nov 15, 2026",
      author: "Flora Team",
      image: "/blog/birthday.png",
      excerpt: "Surprising your loved ones doesn't have to be expensive! With these 5 simple tips, you can plan the perfect home party without breaking the bank."
    },
    {
      id: 2,
      title: "How to Choose the Perfect Anniversary Gift: 2026 Guide 💝",
      category: "Gifting Tips",
      date: "Nov 08, 2026",
      author: "Aditi Sharma",
      image: "/blog/anniversary.png",
      excerpt: "Every anniversary is special! Learn how to select a meaningful gift that will bring a genuine smile to your partner's face."
    },
    {
      id: 3,
      title: "Modern Decoration Trends: Neon Signs & Pastel Balloons ✨",
      category: "Decorations",
      date: "Oct 25, 2026",
      author: "Flora Team",
      image: "/blog/decoration.png",
      excerpt: "Say goodbye to old-school decor. Discover the magic of neon signs and pastel balloon arches that make every party 'Instagrammable'."
    },
    {
      id: 4,
      title: "The Ultimate Guide to Selecting the Perfect Celebration Cake 🎂",
      category: "Celebration",
      date: "Oct 12, 2026",
      author: "Expert Baker",
      image: "/blog/cake.png",
      excerpt: "From flavor profiles to artistic designs, we guide you on how to pick a cake that tastes as incredible as it looks."
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-gray-900">
      
      {/* 🚀 Header: Hero Section */}
      <div className="bg-white pt-20 pb-12 text-center border-b border-gray-50">
        <div className="inline-block px-4 py-1 mb-6 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest">
            Flora Inspiration
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 premium-serif tracking-tight px-4 leading-tight">
          Flora Blog: Party & Gifting <span className="text-[#fbbf24]">Expert Advice</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium px-4">
          Discover the latest trends, DIY tips, and professional advice to make your next celebration truly unforgettable.
        </p>
      </div>

      {/* 📄 Content: Blog Grid Section */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {blogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>

      {/* 📬 Footer: Newsletter / CTA Section */}
      <div className="container mx-auto px-4 mt-12 mb-12">
        <div className="bg-[#10141b] rounded-[50px] py-16 p-8 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#fbbf24]/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 premium-serif leading-tight">
                    Want More Surprise Tips? ✨
                </h2>
                <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                    Join our exclusive newsletter and get the best decoration ideas and discounts delivered straight to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                    <input 
                        type="email" 
                        placeholder="Your email address..." 
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium focus:outline-none focus:border-[#fbbf24] transition-colors"
                    />
                    <button className="bg-[#fbbf24] text-black font-black px-10 py-4 rounded-2xl hover:bg-[#f59e0b] transition-colors shadow-lg shadow-[#fbbf24]/10">
                        Subscribe Now
                    </button>
                </div>
            </div>
        </div>
      </div>
      
    </div>
  );
};

export default Blog;
