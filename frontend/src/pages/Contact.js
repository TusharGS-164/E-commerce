import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const quickLinks = [
    { emoji: '📋', title: 'FAQs',         desc: 'Find answers to commonly asked questions', link: '/faq'      },
    { emoji: '🚚', title: 'Shipping Info', desc: 'Learn about our shipping policies',        link: '/shipping' },
    { emoji: '↩️', title: 'Returns',       desc: 'Easy 30-day return policy',                link: '/returns'  },
    { emoji: '🔒', title: 'Privacy',       desc: 'How we protect your data',                 link: '/privacy'  },
  ];

  return (
    <div className="contact-page">

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Get in touch with us!</p>
        </div>
      </section>

      {/* ── Body ────────────────────────────────────────── */}
      <div className="contact-container">

        {/* Two-column grid */}
        <div className="contact-grid">

          {/* ── Left: Contact Form ──────────────────── */}
          <div className="contact-form-col">
            <h2 className="contact-col-title">Send Us a Message</h2>
            <p className="contact-col-sub">
              Fill out the form below and we'll get back to you within 24 hours
            </p>

            {/* Success banner */}
            {submitted && (
              <div className="contact-success-alert">
                <CheckCircle size={20} />
                <span>Thank you! Your message has been sent successfully.</span>
              </div>
            )}

            <form className="contact-form-card" onSubmit={handleSubmit}>

              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label className="contact-label">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="contact-input"
                    required
                  />
                </div>
                <div className="contact-form-group">
                  <label className="contact-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="contact-input"
                    required
                  />
                </div>
              </div>

              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label className="contact-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="contact-input"
                  />
                </div>
                <div className="contact-form-group">
                  <label className="contact-label">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="contact-input"
                    required
                  />
                </div>
              </div>

              <div className="contact-form-group">
                <label className="contact-label">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  rows="6"
                  className="contact-textarea"
                  required
                />
              </div>

              <button
                type="submit"
                className="contact-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="contact-spinner" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>

            </form>
          </div>

          {/* ── Right: Contact Info ──────────────────── */}
          <div className="contact-info-col">
            <h2 className="contact-col-title">Contact Information</h2>
            <p className="contact-col-sub">
              Reach out to us through any of these channels
            </p>

            <div className="contact-info-list">

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <MapPin size={26} />
                </div>
                <div className="contact-info-body">
                  <h3>Visit Our Store</h3>
                  <p>123 Tech Street, Indiranagar</p>
                  <p>Bangalore, Karnataka 560038</p>
                  <p>India</p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <Phone size={26} />
                </div>
                <div className="contact-info-body">
                  <h3>Call Us</h3>
                  <p><strong>Toll Free:</strong> 1800-123-4567</p>
                  <p><strong>Mobile:</strong> +91 80-1234-5678</p>
                  <p><strong>WhatsApp:</strong> +91 98765-43210</p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <Mail size={26} />
                </div>
                <div className="contact-info-body">
                  <h3>Email Us</h3>
                  <p><strong>Support:</strong> support@technest.com</p>
                  <p><strong>Sales:</strong> sales@technest.com</p>
                  <p><strong>Careers:</strong> careers@technest.com</p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <Clock size={26} />
                </div>
                <div className="contact-info-body">
                  <h3>Business Hours</h3>
                  <p><strong>Mon – Sat:</strong> 9:00 AM – 8:00 PM</p>
                  <p><strong>Sunday:</strong> 10:00 AM – 6:00 PM</p>
                  <p><strong>Holidays:</strong> 10:00 AM – 4:00 PM</p>
                </div>
              </div>

            </div>

            {/* Social media */}
            <div className="contact-social-card">
              <h3>Follow Us</h3>
              <div className="contact-social-list">

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-link facebook"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-link instagram"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  Instagram
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-link twitter"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </a>

              </div>
            </div>

          </div>
        </div>

        {/* ── Map ─────────────────────────────────────── */}
        <div className="contact-map-section">
          <h2 className="contact-section-title">Find Us Here</h2>
          <div className="contact-map-wrapper">
            <iframe
              title="TechNest Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.8362373!2d77.6410796!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjgiTiA3N8KwMzgnMjcuOSJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* ── Quick help ───────────────────────────────── */}
        <div className="contact-quickhelp-section">
          <h2 className="contact-section-title">Quick Help</h2>
          <div className="contact-quickhelp-grid">
            {quickLinks.map((item) => (
              <a key={item.title} href={item.link} className="contact-quickhelp-card">
                <span className="contact-quickhelp-emoji">{item.emoji}</span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;