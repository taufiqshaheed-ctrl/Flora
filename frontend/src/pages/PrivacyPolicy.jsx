import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
      <span className="w-2 h-6 bg-[#fbbf24] rounded-full inline-block"></span>
      {title}
    </h2>
    <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* Hero */}
      <div className="bg-[#fbbf24] py-16 text-center px-4">
        <div className="flex justify-center mb-4">
          <div className="bg-white/30 p-3 rounded-full">
            <ShieldCheck size={36} className="text-gray-900" />
          </div>
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Privacy Policy</h1>
        <p className="text-lg text-gray-800 max-w-2xl mx-auto font-medium">
          How Floral Adda collects, uses, and protects your personal information.
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-3xl py-16">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12">

          <p className="text-gray-500 text-sm mb-10 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <strong>Effective Date:</strong> April 2026 &nbsp;|&nbsp; <strong>Business:</strong> Floral Adda (Gokul Floral), Deoghar, Jharkhand
          </p>

          <Section title="Who We Are">
            <p>
              Floral Adda is a flower and gift shop operating under the trade name "Gokul Floral", located at Near SBI ATM, Bajla Chowk, Deoghar, Jharkhand 814112. We operate the website and online store at this platform to facilitate orders for flowers, gifts, and celebration items.
            </p>
            <p>
              For any privacy-related concerns, you may contact us at: <strong>floraladdaofficial@gmail.com</strong> or <strong>+91 8877803931</strong>.
            </p>
          </Section>

          <Section title="Information We Collect">
            <p>When you use our platform, we may collect the following information:</p>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-2">
              <li><strong>Account Information:</strong> Name, email address, and password (stored securely using hashing)</li>
              <li><strong>Order Information:</strong> Delivery address, contact number, and order details</li>
              <li><strong>Payment Information:</strong> We do not store card numbers or UPI IDs. Payments are processed via trusted third-party gateways.</li>
              <li><strong>Communication Data:</strong> Messages sent through the Contact form (name, email, message)</li>
              <li><strong>Usage Data:</strong> Pages visited, browser type, and device information (collected anonymously for improving our service)</li>
            </ul>
          </Section>

          <Section title="How We Use Your Information">
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>To process and fulfil your orders</li>
              <li>To communicate delivery status, order confirmations, and updates</li>
              <li>To respond to queries and support requests</li>
              <li>To send occasional promotional offers (you may unsubscribe at any time)</li>
              <li>To improve our website and services</li>
              <li>To comply with applicable laws and regulations</li>
            </ul>
          </Section>

          <Section title="Data Sharing">
            <p>We do not sell, trade, or rent your personal information to third parties. We may share limited data with:</p>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-2">
              <li><strong>Delivery partners</strong> — only the name, address, and phone number required for delivery</li>
              <li><strong>Payment gateways</strong> — for secure transaction processing</li>
              <li><strong>Email service providers</strong> — for sending transactional emails (e.g., order confirmation, OTP)</li>
              <li><strong>Legal authorities</strong> — if required by law or court order</li>
            </ul>
          </Section>

          <Section title="Data Security">
            <p>
              We take reasonable technical and organisational measures to protect your personal data. Your password is stored using industry-standard hashing (bcrypt). All communication between your browser and our servers uses HTTPS encryption.
            </p>
            <p>
              However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              Our website may use cookies and similar tracking technologies to enhance your browsing experience, remember your session, and analyse traffic. You can control cookie settings through your browser. Disabling cookies may affect some features of the website.
            </p>
          </Section>

          <Section title="Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt out of marketing communications</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at <strong>floraladdaofficial@gmail.com</strong>.</p>
          </Section>

          <Section title="Children's Privacy">
            <p>
              Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.
            </p>
          </Section>

          <Section title="Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify users of significant changes by posting the updated policy on this page with a revised effective date.
            </p>
          </Section>

          <Section title="Contact">
            <p>If you have any questions about this Privacy Policy, please reach us at:</p>
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

export default PrivacyPolicy;
