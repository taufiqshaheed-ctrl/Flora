import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Phone, Mail } from 'lucide-react';

const faqs = [
  {
    category: 'Orders & Delivery',
    items: [
      {
        q: 'What areas do you deliver to?',
        a: 'We deliver across Deoghar and surrounding areas in Jharkhand. For local deliveries within Deoghar city, we offer same-day delivery. Please contact us at +91 8877803931 to confirm delivery availability for your pincode.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Same-day delivery is available for orders placed before 4:00 PM. Standard orders are delivered within 2–3 hours within the city. Midnight deliveries are available on request for an additional charge.',
      },
      {
        q: 'Can I schedule a delivery for a specific time?',
        a: 'Yes! We accept time-slot delivery requests. Please mention your preferred delivery time in the order notes or contact us on +91 8877803931 after placing your order.',
      },
      {
        q: 'Do you offer midnight deliveries?',
        a: 'Yes, we offer midnight cake and bouquet deliveries for birthdays and anniversaries. Additional charges apply. Please call or message us at least 6 hours in advance to arrange a midnight delivery.',
      },
    ],
  },
  {
    category: 'Products & Freshness',
    items: [
      {
        q: 'Are your flowers fresh?',
        a: 'Absolutely. We source fresh flowers daily from our suppliers. All bouquets are assembled on the day of delivery to ensure maximum freshness and longevity.',
      },
      {
        q: 'Can I customise a bouquet or gift?',
        a: 'Yes! We love creating custom arrangements. You can reach out via our Contact page or call +91 8877803931 to discuss your requirements. Custom orders may need 24–48 hours advance notice.',
      },
      {
        q: 'Do you offer gift wrapping?',
        a: 'Yes, all our products are beautifully packaged. Premium gift wrapping with personalised cards is available at no extra cost for most items.',
      },
    ],
  },
  {
    category: 'Payments & Pricing',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Credit/Debit Cards (Visa, Mastercard, RuPay), UPI (GPay, PhonePe, Paytm), Digital Wallets, and Cash on Delivery for eligible orders. All online payments are secured with 256-bit SSL encryption.',
      },
      {
        q: 'Is Cash on Delivery available?',
        a: 'Yes, COD is available for standard orders under ₹5,000. Please note that personalised and custom items require full payment upfront and are not eligible for COD.',
      },
    ],
  },
  {
    category: 'Returns & Cancellations',
    items: [
      {
        q: 'Can I cancel my order?',
        a: 'Orders can be cancelled up to 2 hours before the scheduled delivery time. Please contact us immediately at +91 8877803931 or floraladdaofficial@gmail.com if you need to cancel.',
      },
      {
        q: 'What if I receive damaged or wilted flowers?',
        a: 'We stand by the quality of our products. If your order arrives damaged, wilted, or incorrect, please take a photograph and contact us within 24 hours. We will arrange a free replacement or issue a full refund.',
      },
      {
        q: 'Do you offer refunds?',
        a: 'Yes. Refunds are processed for valid quality complaints or cancellations made within the eligible window. Refunds to your original payment method typically take 3–7 business days. See our Returns Policy for full details.',
      },
    ],
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold text-gray-900 pr-4">{q}</span>
        <ChevronDown
          size={20}
          className={`text-[#fbbf24] shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-6 bg-white">
          <p className="text-gray-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* Hero */}
      <div className="bg-[#fbbf24] py-16 text-center px-4">
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-800 max-w-2xl mx-auto font-medium">
          Everything you need to know about ordering from Floral Adda.
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-3xl py-16">

        {faqs.map(section => (
          <div key={section.category} className="mb-12">
            <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#fbbf24] rounded-full inline-block"></span>
              {section.category}
            </h2>
            <div className="space-y-3">
              {section.items.map(item => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}

        {/* Still have questions */}
        <div className="bg-[#10141b] rounded-3xl p-10 text-white text-center mt-8">
          <h3 className="text-2xl font-black mb-3">Still have a question?</h3>
          <p className="text-gray-400 mb-8">Our team is available daily from 9 AM – 9 PM to help you.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="tel:+918877803931" className="flex items-center justify-center gap-2 bg-[#fbbf24] text-gray-900 font-black px-6 py-3 rounded-xl hover:bg-[#f5b000] transition-all">
              <Phone size={18} /> +91 8877803931
            </a>
            <Link to="/contact" className="flex items-center justify-center gap-2 border border-gray-600 text-white font-bold px-6 py-3 rounded-xl hover:border-[#fbbf24] hover:text-[#fbbf24] transition-all">
              <Mail size={18} /> Send a Message
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FAQ;
