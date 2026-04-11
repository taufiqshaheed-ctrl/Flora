import React from 'react';
import { FileText } from 'lucide-react';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
      <span className="w-2 h-6 bg-[#fbbf24] rounded-full inline-block"></span>
      {title}
    </h2>
    <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

const Terms = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* Hero */}
      <div className="bg-[#fbbf24] py-16 text-center px-4">
        <div className="flex justify-center mb-4">
          <div className="bg-white/30 p-3 rounded-full">
            <FileText size={36} className="text-gray-900" />
          </div>
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Terms & Conditions</h1>
        <p className="text-lg text-gray-800 max-w-2xl mx-auto font-medium">
          Please read these terms carefully before using our platform.
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-3xl py-16">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12">

          <p className="text-gray-500 text-sm mb-10 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <strong>Effective Date:</strong> April 2026 &nbsp;|&nbsp; <strong>Business:</strong> Floral Adda (Gokul Floral), Deoghar, Jharkhand
          </p>

          <Section title="Acceptance of Terms">
            <p>
              By accessing or using the Floral Adda website and placing orders through our platform, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </Section>

          <Section title="About Us">
            <p>
              Floral Adda is operated by Gokul Floral, a flower and gift retail business based in Deoghar, Jharkhand. We provide online ordering of flowers, bouquets, cakes, and gifts with home delivery across Deoghar and surrounding areas.
            </p>
            <p>
              Contact: <strong>floraladdaofficial@gmail.com</strong> | <strong>+91 8877803931</strong>
            </p>
          </Section>

          <Section title="Eligibility">
            <p>
              Our services are available to users who are 13 years of age or older. By creating an account and placing an order, you confirm that you are of eligible age and that all information you provide is accurate and truthful.
            </p>
          </Section>

          <Section title="Account Registration">
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>You must register and verify your email address to place orders.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must immediately notify us if you suspect any unauthorised access to your account.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
            </ul>
          </Section>

          <Section title="Orders & Pricing">
            <p>
              All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. Prices may change without prior notice; however, the price at the time of placing the order will be honoured.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 pl-2">
              <li>Orders are confirmed only after successful payment or COD acknowledgement.</li>
              <li>We reserve the right to cancel orders in case of stock unavailability, pricing errors, or suspected fraud.</li>
              <li>Delivery availability and charges depend on your location and order value.</li>
            </ul>
          </Section>

          <Section title="Delivery">
            <p>
              We endeavour to deliver all orders within the promised timeframes. However, delivery may be affected by factors beyond our control (weather, traffic, festivals, etc.). We are not liable for delays caused by such circumstances.
            </p>
            <p>
              The customer is responsible for providing a correct and complete delivery address. Re-delivery attempts due to incorrect address or unavailability may attract additional charges.
            </p>
          </Section>

          <Section title="Perishable Products">
            <p>
              Flowers, cakes, and fresh items are perishable in nature. Once delivered in good condition, Floral Adda is not responsible for their condition after 24–48 hours, as their lifespan depends on handling, environment, and storage by the recipient.
            </p>
          </Section>

          <Section title="Returns & Refunds">
            <p>
              Refunds and replacements are available for damaged, incorrect, or significantly unsatisfactory products as detailed in our Returns & Refund Policy. Claims must be raised within 24 hours of delivery with photographic evidence.
            </p>
          </Section>

          <Section title="Intellectual Property">
            <p>
              All content on this website — including images, text, logos, and design — is the property of Floral Adda / Gokul Floral and is protected under applicable intellectual property laws. You may not reproduce, distribute, or use our content without prior written permission.
            </p>
          </Section>

          <Section title="Prohibited Activities">
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-2">
              <li>Use our platform for any unlawful purpose</li>
              <li>Submit false, misleading, or fraudulent orders</li>
              <li>Attempt to gain unauthorised access to any part of our system</li>
              <li>Post offensive, defamatory, or inappropriate content</li>
              <li>Resell or commercially exploit our products without authorisation</li>
            </ul>
          </Section>

          <Section title="Limitation of Liability">
            <p>
              Floral Adda's liability for any claim arising from the use of our services is limited to the value of the order in question. We are not liable for indirect, incidental, or consequential damages arising out of your use of our services.
            </p>
          </Section>

          <Section title="Governing Law">
            <p>
              These Terms & Conditions are governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in Deoghar, Jharkhand.
            </p>
          </Section>

          <Section title="Changes to Terms">
            <p>
              We reserve the right to modify these Terms & Conditions at any time. Continued use of our platform after changes have been published constitutes your acceptance of the revised terms.
            </p>
          </Section>

          <Section title="Contact">
            <p>For questions or concerns about these terms, reach us at:</p>
            <div className="bg-gray-50 rounded-2xl p-6 mt-3 space-y-2 text-sm">
              <p><strong>Floral Adda (Gokul Floral)</strong></p>
              <p>Near SBI ATM, Bajla Chowk, Deoghar, Jharkhand 814112</p>
              <p>📞 +91 8877803931</p>
              <p>✉ floraladdaofficial@gmail.com</p>
              <p>🕐 9:00 AM – 9:00 PM (Daily)</p>
            </div>
          </Section>

        </div>

        <p className="text-center text-xs text-gray-400 mt-8">Last updated: April 2026 · Floral Adda, Deoghar</p>
      </div>
    </div>
  );
};

export default Terms;
