import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from 'lucide-react';
import './Returns.css';

const Privacy = () => {
  return (
    <div className="privacy-page">
      {/* Hero */}
      <section className="privacy-hero">
        <div className="container">
          <Shield size={60} className="hero-icon" />
          <h1>Privacy Policy</h1>
          <p>Your privacy and data security are our top priorities</p>
          <p style={{fontSize: '0.9rem', opacity: 0.9, marginTop: '10px'}}>
            Last Updated: February 14, 2026
          </p>
        </div>
      </section>

      <div className="container">
        {/* Quick Summary */}
        <section className="quick-summary">
          <div className="summary-cards">
            <div className="summary-card">
              <Lock size={40} />
              <h3>Encrypted</h3>
              <p>All data is encrypted</p>
            </div>
            <div className="summary-card">
              <Eye size={40} />
              <h3>No Selling</h3>
              <p>We never sell your data</p>
            </div>
            <div className="summary-card">
              <Database size={40} />
              <h3>Secure Storage</h3>
              <p>Bank-level security</p>
            </div>
            <div className="summary-card">
              <UserCheck size={40} />
              <h3>Your Control</h3>
              <p>You own your data</p>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="policy-section">
          <div className="privacy-toc">
            <h3>Table of Contents</h3>
            <ul>
              <li><a href="#introduction">1. Introduction</a></li>
              <li><a href="#information-collect">2. Information We Collect</a></li>
              <li><a href="#how-we-use">3. How We Use Your Information</a></li>
              <li><a href="#information-sharing">4. Information Sharing</a></li>
              <li><a href="#data-security">5. Data Security</a></li>
              <li><a href="#cookies">6. Cookies and Tracking</a></li>
              <li><a href="#your-rights">7. Your Rights</a></li>
              <li><a href="#data-retention">8. Data Retention</a></li>
              <li><a href="#children">9. Children's Privacy</a></li>
              <li><a href="#changes">10. Changes to This Policy</a></li>
              <li><a href="#contact">11. Contact Us</a></li>
            </ul>
          </div>
        </section>

        {/* Introduction */}
        <section className="policy-section" id="introduction">
          <h2>1. Introduction</h2>
          <div className="policy-content">
            <p>
              Welcome to TechStore. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our 
              website or mobile app and tell you about your privacy rights and how the law protects you.
            </p>
            <p>
              This privacy policy applies to information we collect when you:
            </p>
            <ul>
              <li>Use our website (www.techstore.com)</li>
              <li>Use our mobile application</li>
              <li>Make a purchase from us</li>
              <li>Sign up for our newsletter or marketing communications</li>
              <li>Contact our customer service</li>
              <li>Interact with us on social media</li>
            </ul>
          </div>
        </section>

        {/* Information We Collect */}
        <section className="policy-section" id="information-collect">
          <h2>2. Information We Collect</h2>
          <div className="policy-content">
            <h3>Personal Information You Provide</h3>
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, phone number, password</li>
              <li><strong>Billing Information:</strong> Billing address, payment method details (processed securely by Razorpay)</li>
              <li><strong>Shipping Information:</strong> Delivery address, contact number</li>
              <li><strong>Profile Information:</strong> Profile picture, preferences, wishlist items</li>
              <li><strong>Communication:</strong> Messages, reviews, ratings, customer support inquiries</li>
              <li><strong>Social Media:</strong> Information from social login (Google, Facebook) if you choose to use it</li>
            </ul>

            <h3>Information Collected Automatically</h3>
            <p>When you use our services, we automatically collect:</p>
            <ul>
              <li><strong>Device Information:</strong> Device type, operating system, browser type, IP address</li>
              <li><strong>Usage Information:</strong> Pages viewed, time spent, clicks, search queries</li>
              <li><strong>Location Information:</strong> Approximate location based on IP address</li>
              <li><strong>Cookies:</strong> See our Cookies section for more details</li>
            </ul>

            <h3>Information from Third Parties</h3>
            <p>We may receive information from:</p>
            <ul>
              <li>Payment processors (Razorpay) for transaction details</li>
              <li>Delivery partners for shipping status</li>
              <li>Social media platforms if you connect your accounts</li>
              <li>Analytics providers for usage statistics</li>
            </ul>
          </div>
        </section>

        {/* How We Use Information */}
        <section className="policy-section" id="how-we-use">
          <h2>3. How We Use Your Information</h2>
          <div className="policy-content">
            <p>We use your information for the following purposes:</p>
            
            <h3>To Provide Our Services</h3>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Manage your account and profile</li>
              <li>Process payments securely</li>
              <li>Arrange delivery and shipping</li>
              <li>Provide customer support</li>
              <li>Send order confirmations and updates</li>
            </ul>

            <h3>To Improve Our Services</h3>
            <ul>
              <li>Understand how customers use our platform</li>
              <li>Develop new features and products</li>
              <li>Conduct research and analytics</li>
              <li>Test and troubleshoot new features</li>
            </ul>

            <h3>To Communicate With You</h3>
            <ul>
              <li>Send promotional emails and offers (with your consent)</li>
              <li>Send important updates about your orders</li>
              <li>Respond to your inquiries and requests</li>
              <li>Send security alerts and notifications</li>
            </ul>

            <h3>For Security and Fraud Prevention</h3>
            <ul>
              <li>Verify your identity</li>
              <li>Detect and prevent fraud</li>
              <li>Secure our platform</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>
        </section>

        {/* Information Sharing */}
        <section className="policy-section" id="information-sharing">
          <h2>4. Information Sharing</h2>
          <div className="policy-content">
            <p>
              We do not sell, rent, or trade your personal information to third parties. We may share your 
              information only in the following circumstances:
            </p>

            <h3>Service Providers</h3>
            <p>We share information with trusted third-party service providers who help us operate our business:</p>
            <ul>
              <li><strong>Payment Processors:</strong> Razorpay (for secure payment processing)</li>
              <li><strong>Shipping Partners:</strong> Courier companies for order delivery</li>
              <li><strong>Cloud Storage:</strong> AWS, Google Cloud (for secure data storage)</li>
              <li><strong>Email Service:</strong> SendGrid (for transactional and marketing emails)</li>
              <li><strong>Analytics:</strong> Google Analytics (for website analytics)</li>
            </ul>

            <h3>Legal Requirements</h3>
            <p>We may disclose your information if required by law or in response to:</p>
            <ul>
              <li>Court orders or legal processes</li>
              <li>Government investigations</li>
              <li>Compliance with tax and financial regulations</li>
              <li>Protection of our legal rights</li>
            </ul>

            <h3>Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, your information may be transferred 
              to the new owner. We will notify you of any such change.
            </p>

            <h3>With Your Consent</h3>
            <p>
              We may share your information with third parties when you explicitly consent to such sharing.
            </p>
          </div>
        </section>

        {/* Data Security */}
        <section className="policy-section" id="data-security">
          <h2>5. Data Security</h2>
          <div className="policy-content">
            <p>
              We implement robust security measures to protect your personal information from unauthorized 
              access, disclosure, alteration, or destruction:
            </p>

            <h3>Technical Safeguards</h3>
            <ul>
              <li><strong>Encryption:</strong> All data transmitted is encrypted using SSL/TLS technology</li>
              <li><strong>Secure Servers:</strong> Data is stored on secure servers with restricted access</li>
              <li><strong>Firewall Protection:</strong> Network firewalls protect against unauthorized access</li>
              <li><strong>Regular Backups:</strong> Data is backed up regularly to prevent loss</li>
              <li><strong>Payment Security:</strong> We never store credit card details; all payments processed via PCI-compliant Razorpay</li>
            </ul>

            <h3>Organizational Safeguards</h3>
            <ul>
              <li>Access to personal data is restricted to authorized personnel only</li>
              <li>Employees are trained on data protection and privacy</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Incident response plan for data breaches</li>
            </ul>

            <div className="warning-box">
              <AlertCircle size={24} />
              <p>
                <strong>Important:</strong> While we implement strong security measures, no method of transmission 
                over the internet is 100% secure. We cannot guarantee absolute security, but we continually work 
                to protect your data.
              </p>
            </div>
          </div>
        </section>

        {/* Cookies */}
        <section className="policy-section" id="cookies">
          <h2>6. Cookies and Tracking Technologies</h2>
          <div className="policy-content">
            <h3>What Are Cookies?</h3>
            <p>
              Cookies are small text files stored on your device when you visit our website. They help us provide 
              you with a better experience by remembering your preferences and improving website functionality.
            </p>

            <h3>Types of Cookies We Use</h3>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for website functionality (login, cart, checkout)</li>
              <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Marketing Cookies:</strong> Track your visits for personalized ads (with consent)</li>
            </ul>

            <h3>Managing Cookies</h3>
            <p>
              You can control cookies through your browser settings. However, disabling certain cookies may affect 
              website functionality. Most browsers allow you to:
            </p>
            <ul>
              <li>View and delete cookies</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies</li>
              <li>Delete cookies when you close your browser</li>
            </ul>

            <h3>Third-Party Cookies</h3>
            <p>We use the following third-party services that may set cookies:</p>
            <ul>
              <li>Google Analytics (website analytics)</li>
              <li>Facebook Pixel (advertising)</li>
              <li>Google Ads (advertising)</li>
            </ul>
          </div>
        </section>

        {/* Your Rights */}
        <section className="policy-section" id="your-rights">
          <h2>7. Your Rights and Choices</h2>
          <div className="policy-content">
            <p>You have the following rights regarding your personal data:</p>

            <h3>Access and Portability</h3>
            <ul>
              <li>Request a copy of your personal data</li>
              <li>Download your data in a portable format</li>
              <li>View what information we hold about you</li>
            </ul>

            <h3>Correction and Update</h3>
            <ul>
              <li>Update your account information anytime</li>
              <li>Correct inaccurate data</li>
              <li>Complete incomplete information</li>
            </ul>

            <h3>Deletion</h3>
            <ul>
              <li>Request deletion of your account and data</li>
              <li>Delete specific information from your profile</li>
              <li>Note: We may retain some data for legal or business purposes</li>
            </ul>

            <h3>Marketing Communications</h3>
            <ul>
              <li>Unsubscribe from marketing emails anytime</li>
              <li>Opt-out of SMS notifications</li>
              <li>Control push notifications in app settings</li>
            </ul>

            <h3>How to Exercise Your Rights</h3>
            <p>To exercise any of these rights, you can:</p>
            <ul>
              <li>Update information in your Account Settings</li>
              <li>Email us at privacy@techstore.com</li>
              <li>Contact customer support</li>
              <li>Use the unsubscribe link in marketing emails</li>
            </ul>
          </div>
        </section>

        {/* Data Retention */}
        <section className="policy-section" id="data-retention">
          <h2>8. Data Retention</h2>
          <div className="policy-content">
            <p>We retain your personal information for as long as necessary to:</p>
            <ul>
              <li>Provide our services to you</li>
              <li>Comply with legal obligations (tax, accounting, audit)</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Prevent fraud and abuse</li>
            </ul>

            <h3>Retention Periods</h3>
            <ul>
              <li><strong>Active Accounts:</strong> Retained while account is active</li>
              <li><strong>Inactive Accounts:</strong> Deleted after 3 years of inactivity</li>
              <li><strong>Order Information:</strong> Retained for 7 years (tax compliance)</li>
              <li><strong>Marketing Data:</strong> Deleted upon unsubscribe request</li>
              <li><strong>Cookies:</strong> Varies (see Cookies section)</li>
            </ul>

            <p>
              After the retention period, we securely delete or anonymize your data. You can request deletion 
              of your account at any time from Account Settings.
            </p>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="policy-section" id="children">
          <h2>9. Children's Privacy</h2>
          <div className="policy-content">
            <p>
              Our services are not intended for children under 18 years of age. We do not knowingly collect 
              personal information from children under 18. If you are under 18, please do not provide any 
              information on our website or app.
            </p>
            <p>
              If we become aware that we have collected personal information from a child under 18, we will 
              take steps to delete that information immediately. If you believe we might have information 
              from or about a child under 18, please contact us at privacy@techstore.com.
            </p>
          </div>
        </section>

        {/* Changes to Policy */}
        <section className="policy-section" id="changes">
          <h2>10. Changes to This Privacy Policy</h2>
          <div className="policy-content">
            <p>
              We may update this privacy policy from time to time to reflect changes in our practices or for 
              legal, operational, or regulatory reasons. When we make changes, we will:
            </p>
            <ul>
              <li>Update the "Last Updated" date at the top of this policy</li>
              <li>Notify you via email for significant changes</li>
              <li>Display a prominent notice on our website</li>
              <li>Request your consent if required by law</li>
            </ul>
            <p>
              We encourage you to review this privacy policy periodically. Your continued use of our services 
              after changes indicates your acceptance of the updated policy.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="policy-section" id="contact">
          <h2>11. Contact Us</h2>
          <div className="policy-content">
            <p>
              If you have any questions, concerns, or requests regarding this privacy policy or our data 
              practices, please contact us:
            </p>

            <div className="info-box">
              <Lock size={24} />
              <div>
                <p><strong>Privacy Team</strong></p>
                <p>Email: privacy@techstore.com</p>
                <p>Phone: 1800-123-4567 (Toll Free)</p>
                <p>Address: 123 Tech Street, Indiranagar, Bangalore, Karnataka 560038, India</p>
                <p>Business Hours: Monday - Saturday, 9:00 AM - 8:00 PM IST</p>
              </div>
            </div>

            <p>
              We will respond to your inquiry within 48 hours. For urgent privacy concerns, please call our 
              customer support line.
            </p>
          </div>
        </section>

        {/* Additional Information */}
        <section className="policy-section">
          <h2>Additional Information</h2>
          <div className="policy-content">
            <h3>Compliance</h3>
            <p>
              We comply with applicable data protection laws including the Information Technology Act, 2000 
              and the Digital Personal Data Protection Act, 2023 (India). We are committed to protecting your 
              privacy rights and handling your data responsibly.
            </p>

            <h3>International Transfers</h3>
            <p>
              Your data is primarily stored in India. If we transfer data outside India, we ensure appropriate 
              safeguards are in place to protect your information.
            </p>

            <h3>Data Protection Officer</h3>
            <p>
              For privacy-related queries, you can contact our Data Protection Officer at dpo@techstore.com
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="contact-cta">
          <div className="cta-content">
            <Shield size={50} />
            <h2>Questions About Privacy?</h2>
            <p>We're here to help protect your data and answer your questions</p>
            <div className="cta-buttons">
              <Link to="/contact" className="cta-btn primary">Contact Privacy Team</Link>
              <Link to="/faq" className="cta-btn secondary">Privacy FAQs</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Privacy;