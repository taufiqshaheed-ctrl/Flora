import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, AlertTriangle, CheckCircle2, XCircle, Phone, Mail, Clock } from 'lucide-react';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
      <span className="w-2 h-6 bg-[#fbbf24] rounded-full inline-block"></span>
      {title}
    </h2>
    <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

const Returns = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* Hero */}
      <div className="bg-[#fbbf24] py-16 text-center px-4">
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Returns & Refund Policy</h1>
        <p className="text-lg text-gray-800 max-w-2xl mx-auto font-medium">
          We want you to be completely satisfied with every order from Floral Adda.
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-3xl py-16">

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          <div className="bg-white rounded-2xl p-6 border border-green-100 text-center">
            <CheckCircle2 size={32} className="text-green-500 mx-auto mb-3" />
            <p className="font-black text-gray-900 text-sm">Free Replacement</p>
            <p className="text-xs text-gray-500 mt-1">For damaged or wrong items</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-blue-100 text-center">
            <RefreshCw size={32} className="text-blue-500 mx-auto mb-3" />
            <p className="font-black text-gray-900 text-sm">Full Refund</p>
            <p className="text-xs text-gray-500 mt-1">Processed in 3–7 business days</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-yellow-100 text-center">
            <Clock size={32} className="text-yellow-500 mx-auto mb-3" />
            <p className="font-black text-gray-900 text-sm">Report Within 24 hrs</p>
            <p className="text-xs text-gray-500 mt-1">Of receiving your order</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12">

          <Section title="Our Commitment to Quality">
            <p>
              At Floral Adda, we take pride in every arrangement and gift we send out. All flowers are sourced fresh daily and all products are carefully inspected before dispatch. However, if anything goes wrong, we make it right — no questions asked.
            </p>
          </Section>

          <Section title="Eligible for Return / Replacement">
            <ul className="space-y-2">
              {[
                'Flowers received wilted, dead, or in significantly poor condition',
                'Wrong product, bouquet, or gift delivered',
                'Order delivered significantly late — causing the occasion to be missed',
                'Product damaged during delivery (packaging damage with product impact)',
                'Incorrect personalisation on custom-made items',
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Not Eligible for Return">
            <ul className="space-y-2">
              {[
                'Change of mind after the order has been dispatched',
                'Flowers that have wilted naturally after 48 hours of delivery (perishable nature)',
                'Customised / personalised items unless there is a quality defect or error on our part',
                'Issues reported more than 24 hours after delivery',
                'Damage caused after delivery due to improper handling or storage',
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <XCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="How to Raise a Complaint">
            <p>If you have an issue with your order, please follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2 mt-2 pl-2">
              <li>Take clear photographs of the damaged/incorrect item(s).</li>
              <li>Contact us within <strong>24 hours</strong> of receiving the order.</li>
              <li>Reach us via phone at <strong>+91 8877803931</strong> or email at <strong>floraladdaofficial@gmail.com</strong>.</li>
              <li>Include your order ID, photos, and a brief description of the issue.</li>
            </ol>
            <p className="mt-3">We will review your complaint and respond within <strong>4–6 business hours</strong>.</p>
          </Section>

          <Section title="Order Cancellation">
            <p>
              You may cancel your order <strong>up to 2 hours before</strong> the scheduled delivery time. To cancel, contact us immediately on +91 8877803931.
            </p>
            <p>
              Once an order has been dispatched or is in transit, it cannot be cancelled. For perishable items like fresh flowers and cakes, cancellations are accepted only if adequate notice is provided.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl mt-4 flex gap-3">
              <AlertTriangle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                <strong>Custom / personalised orders</strong> (photo cakes, engraved gifts, custom bouquets) are prepared specifically for you and <strong>cannot be cancelled</strong> once production has begun.
              </p>
            </div>
          </Section>

          <Section title="Refund Process">
            <p>Once your return/complaint is approved:</p>
            <ul className="space-y-2 mt-2">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
                <span><strong>Replacement:</strong> A new order will be dispatched at no extra cost on the same day or the next day depending on availability.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
                <span><strong>Refund:</strong> Credited back to your original payment method within <strong>3–7 business days</strong>. UPI/Wallet refunds are typically faster (1–3 days).</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
                <span><strong>COD Orders:</strong> Refunds for Cash on Delivery orders will be processed via bank transfer. Please share your bank account details when raising the complaint.</span>
              </li>
            </ul>
          </Section>

          <Section title="Contact Us">
            <p>For any return or refund-related queries, our team is available from 9:00 AM to 9:00 PM every day.</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <a href="tel:+918877803931" className="flex items-center gap-2 font-bold text-gray-900 bg-gray-50 px-5 py-3 rounded-xl border border-gray-100 hover:border-[#fbbf24] transition-all">
                <Phone size={16} className="text-[#fbbf24]" /> +91 8877803931
              </a>
              <a href="mailto:floraladdaofficial@gmail.com" className="flex items-center gap-2 font-bold text-gray-900 bg-gray-50 px-5 py-3 rounded-xl border border-gray-100 hover:border-[#fbbf24] transition-all">
                <Mail size={16} className="text-[#fbbf24]" /> floraladdaofficial@gmail.com
              </a>
            </div>
          </Section>

        </div>

        <p className="text-center text-xs text-gray-400 mt-8">Last updated: April 2026 · Floral Adda, Deoghar</p>

      </div>
    </div>
  );
};

export default Returns;
