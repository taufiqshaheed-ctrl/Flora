import React from 'react';
import { ChevronRight, Calendar, User } from 'lucide-react';

/**
 * BlogCard Component
 * Renders a single blog post card with image, category, date, and excerpt.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.blog - The blog data object
 */
const BlogCard = ({ blog }) => {
  return (
    <div className="group cursor-pointer flex flex-col items-start">
      {/* Blog Image & Category Badge */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[32px] mb-8 shadow-2xl shadow-gray-200/50 border border-gray-100">
        <img 
          src={blog.image} 
          alt={blog.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
        />
        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black text-gray-900 uppercase tracking-widest shadow-sm">
          {blog.category}
        </div>
      </div>
      
      {/* Metadata (Date & Author) */}
      <div className="flex items-center gap-6 mb-4 text-[13px] font-bold text-gray-400">
        <span className="flex items-center gap-1.5">
          <Calendar size={14} className="text-[#fbbf24]" /> {blog.date}
        </span>
        <span className="flex items-center gap-1.5">
          <User size={14} className="text-[#fbbf24]" /> {blog.author}
        </span>
      </div>

      {/* Blog Title */}
      <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 leading-tight group-hover:text-[#f05a1b] transition-colors premium-serif">
        {blog.title}
      </h3>
      
      {/* Blog Excerpt */}
      <p className="text-gray-500 text-lg leading-relaxed mb-6">
        {blog.excerpt}
      </p>
      
      {/* Read More Button */}
      <button className="flex items-center gap-2 group/btn font-black text-black text-xs uppercase tracking-widest pb-1 border-b-2 border-transparent hover:border-[#fbbf24] transition-all">
        Read Article <ChevronRight size={18} className="translate-y-[0.5px] group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default BlogCard;
