import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Heart, Star, Users, Leaf } from 'lucide-react';
import heroImg from '../assets/slider.png/image1.jpeg';

const About = () => {
  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-gray-900">

      {/* Hero */}
      <div className="bg-[#fbbf24] py-20 text-center px-4">
        <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/30 text-gray-900 text-[10px] font-black uppercase tracking-widest">
          Our Story
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
          We Are <span className="text-white">Floral Adda</span>
        </h1>
        <p className="text-lg text-gray-800 max-w-2xl mx-auto font-medium">
          Deoghar's favourite destination for flowers, gifts & celebration essentials — delivering happiness since day one.
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-6 leading-tight">
              Born from a love of <span className="text-[#fbbf24]">celebrations</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-lg">
              Floral Adda started with a simple belief — that every celebration, big or small, deserves to be made special. Located in the heart of Deoghar, Jharkhand, we have been crafting beautiful floral arrangements and curating thoughtful gifts for every occasion.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4 text-lg">
              From birthdays to weddings, anniversaries to festivals — our team works with passion to ensure every bouquet is fresh, every gift is meaningful, and every delivery arrives with a smile.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Operating out of our boutique store at Bajla Chowk, Deoghar, we serve customers across the city and surrounding areas, ensuring same-day delivery for those last-minute surprises.
            </p>
          </div>
          <div className="relative">
            <img
              src={heroImg}
              alt="Floral Adda store"
              className="rounded-3xl shadow-2xl w-full object-cover h-[450px]"
            />
            <div className="absolute -bottom-6 -left-6 bg-[#fbbf24] rounded-2xl p-6 shadow-xl">
              <p className="text-3xl font-black text-gray-900">100%</p>
              <p className="text-sm font-bold text-gray-800">Fresh Flowers</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="py-16 border-t border-gray-100">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, color: 'bg-red-50 text-red-500', title: 'Made with Love', desc: 'Every arrangement is crafted by hand with care and attention to detail.' },
              { icon: Leaf, color: 'bg-green-50 text-green-600', title: 'Fresh Always', desc: 'We source fresh flowers daily to guarantee top quality in every bouquet.' },
              { icon: Star, color: 'bg-yellow-50 text-yellow-600', title: 'Premium Quality', desc: 'Only the finest blooms and gift products make it to our customers.' },
              { icon: Users, color: 'bg-blue-50 text-blue-600', title: 'Customer First', desc: 'Your satisfaction is our goal — we go the extra mile every single time.' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-md transition-all">
                <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  <Icon size={28} />
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-[#10141b] rounded-3xl p-10 md:p-16 my-16 text-white">
          <h2 className="text-3xl font-black mb-10 text-center">Visit Us or Get in Touch</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-[#fbbf24] rounded-xl flex items-center justify-center">
                <MapPin size={22} className="text-gray-900" />
              </div>
              <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">Address</p>
              <p className="text-white font-medium text-sm leading-relaxed">Gokul Floral, Near SBI ATM,<br />Bajla Chowk, Deoghar,<br />Jharkhand 814112</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-[#fbbf24] rounded-xl flex items-center justify-center">
                <Phone size={22} className="text-gray-900" />
              </div>
              <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">Phone</p>
              <p className="text-white font-medium">+91 8877803931</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-[#fbbf24] rounded-xl flex items-center justify-center">
                <Mail size={22} className="text-gray-900" />
              </div>
              <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">Email</p>
              <p className="text-white font-medium break-all">floraladdaofficial@gmail.com</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-[#fbbf24] rounded-xl flex items-center justify-center">
                <Clock size={22} className="text-gray-900" />
              </div>
              <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">Hours</p>
              <p className="text-white font-medium">9:00 AM – 9:00 PM<br />(Daily)</p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-[#fbbf24] text-gray-900 font-black px-8 py-4 rounded-2xl hover:bg-[#f5b000] transition-all">
              Send Us a Message
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
