import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.MESSAGES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to send message');
      setSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Failed to send your message. Please try again.');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center px-4 py-20 font-sans">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-8">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4 premium-serif tracking-tight">Message Sent!</h2>
          <p className="text-gray-500 text-lg mb-10 leading-relaxed">
            Thank you for reaching out. Our team has received your message and will get back to you within 24 hours.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
          >
            Send Another Message <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-gray-900">
      
      {/* 🚀 Premium Hero Header */}
      <div className="bg-white pt-20 pb-12 text-center border-b border-gray-50">
        <div className="inline-block px-4 py-1 mb-6 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest">
            Get in Touch
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 premium-serif tracking-tight px-4 leading-tight">
          How Can We <span className="text-[#fbbf24]">Help You?</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium px-4">
          Have a question about an order or need a custom gift requirement? Our dedicated boutique team is here to assist you.
        </p>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* 📍 Left: Contact Info */}
          <div className="lg:col-span-5 flex flex-col gap-12">
            <div>
                <h2 className="text-3xl font-black text-gray-900 mb-4 premium-serif">Our Boutique Office</h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                    Visit us or reach out through any of these channels. We love hearing from our customers!
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
                <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-[#fbbf24] transition-colors duration-300">
                        <Phone size={20} className="text-gray-900" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-1">Call Us</h4>
                        <p className="text-lg font-bold text-gray-900">+91 8877803931</p>
                    </div>
                </div>

                <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-[#fbbf24] transition-colors duration-300">
                        <Mail size={20} className="text-gray-900" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-1">Email Us</h4>
                        <p className="text-lg font-bold text-gray-900">floraladdaofficial@gmail.com</p>
                    </div>
                </div>

                <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-[#fbbf24] transition-colors duration-300">
                        <MapPin size={20} className="text-gray-900" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-1">Location</h4>
                        <p className="text-lg font-bold text-gray-900 leading-relaxed">Gokul floral, Near SBI ATM,<br/>Bajla chowk, Deoghar<br/>Jharkhand 814112</p>
                    </div>
                </div>

                <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-[#fbbf24] transition-colors duration-300">
                        <Clock size={20} className="text-gray-900" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-1">Hours</h4>
                        <p className="text-lg font-bold text-gray-900">9:00 AM - 9:00 PM (Daily)</p>
                    </div>
                </div>
            </div>
          </div>

          {/* ✉️ Right: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-gray-200/50 border border-gray-50 border-t-8 border-t-[#fbbf24]">
            <h2 className="text-3xl font-black text-gray-900 mb-8 premium-serif">Send a Message</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-semibold text-center">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">First Name</label>
                  <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" className="px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#fbbf24] transition-all font-medium" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Last Name</label>
                  <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className="px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#fbbf24] transition-all font-medium" />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#fbbf24] transition-all font-medium" />
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">How can we help?</label>
                <textarea required rows="5" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your requirement..." className="px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#fbbf24] transition-all font-medium resize-none"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="inline-flex items-center justify-center gap-3 bg-[#fbbf24] text-black px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-xl shadow-[#fbbf24]/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative group"
              >
                <span className={loading ? 'opacity-0' : 'flex items-center gap-3 transition-opacity'}>
                    Submit Request <Send size={18} />
                </span>
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;

