import React from 'react';
import { Users, ShoppingBag, Star, Award, Shield, Truck, Headphones, MapPin, Phone, Mail } from 'lucide-react';
import './About.css';

const About = () => {
  // const stats = [
  //   { icon: <Users size={40} />, number: '50,000+', label: 'Happy Customers' },
  //   { icon: <ShoppingBag size={40} />, number: '10,000+', label: 'Products Available' },
  //   { icon: <Star size={40} />, number: '4.8/5', label: 'Average Rating' },
  //   { icon: <Award size={40} />, number: '8+', label: 'Years in Business' },
  // ];

  const values = [
    {
      icon: <Shield size={36} />,
      title: 'Quality Assured',
      desc: 'Every product we sell undergoes strict quality checks. We only stock genuine, certified electronics from trusted manufacturers worldwide.'
    },
    {
      icon: <Truck size={36} />,
      title: 'Fast Delivery',
      desc: 'Get your orders delivered within 2–5 business days anywhere in India, with same-day delivery available in Bangalore.'
    },
    {
      icon: <Headphones size={36} />,
      title: 'Expert Support',
      desc: 'Our team of tech experts is available 7 days a week to help you choose the right product and resolve any issues quickly.'
    },
  ];

  const features = [
    { title: 'Genuine Products Only',     desc: 'All items are 100% authentic with official manufacturer warranty.' },
    { title: 'Easy EMI Options',          desc: 'No-cost EMI available on orders above ₹3,000 via all major banks.' },
    { title: '30-Day Easy Returns',       desc: 'Not satisfied? Return within 30 days for a full refund, no questions asked.' },
    { title: 'Secure Payments',           desc: 'Your payment data is encrypted end-to-end and never stored on our servers.' },
    { title: 'Price Match Guarantee',     desc: "Found it cheaper elsewhere? We'll match the price instantly." },
    { title: 'Loyalty Rewards',           desc: 'Earn points on every purchase and redeem them for exclusive discounts.' },
  ];

  return (
    <div className="about-page">

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="about-hero">
        <div className="container px-4 mx-auto">
          <h1>About TechNest</h1>
          <p className="hero-subtitle">
            Bangalore's most trusted destination for premium tech products since 2016
          </p>
        </div>
      </section>

      {/* ── Our Story ────────────────────────────────────────── */}
      <section className="about-section">
        <div className="container px-4 mx-auto">
          <div className="section-content">
            <div className="content-text">
              <h2>Our Story</h2>
              <p>
                TechNest was born in 2016 from a simple frustration — finding genuine tech
                products at fair prices in India was harder than it should be. Our founders,
                two engineers from IISc Bangalore, decided to change that.
              </p>
              <p>
                What started as a small shop in Indiranagar with just 200 products has grown
                into one of South India's most trusted online tech retailers, serving over
                50,000 customers across the country.
              </p>
              <p>
                We built TechNest on three pillars: <strong>authenticity</strong>,{' '}
                <strong>affordability</strong>, and <strong>after-sales care</strong>.
                Every product, every policy, and every decision we make comes back to these values.
              </p>
            </div>
            <div className="content-image">
              <img
                src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=700&q=80"
                alt="TechNest store interior"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      {/* <section className="about-section">
        <div className="container px-4 mx-auto">
          <div className="stats-section">
            <div className="stats-grid">
              {stats.map((stat, i) => (
                <div className="stat-card" key={i}>
                  <div className="stat-icon">{stat.icon}</div>
                  <h3>{stat.number}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* ── Core Values ──────────────────────────────────────── */}
      <section className="about-section values-section">
        <div className="container px-4 mx-auto">
          <h2>What We Stand For</h2>
          <div className="values-grid">
            {values.map((v, i) => (
              <div className="value-card" key={i}>
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────── */}
      <section className="about-section why-choose">
        <div className="container px-4 mx-auto">
          <h2>Why Choose TechNest?</h2>
          <div className="features-list">
            {features.map((f, i) => (
              <div className="feature-item" key={i}>
                <div className="feature-icon">✓</div>
                <div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Info ─────────────────────────────────────── */}
      <section className="about-section contact-info">
        <div className="container px-4 mx-auto">
          <h2>Get In Touch</h2>
          <div className="contact-grid">
            <div className="contact-card">
              <MapPin size={40} />
              <h4>Visit Us</h4>
              <p>123 Tech Street, Indiranagar</p>
              <p>Bangalore, Karnataka 560038</p>
              <p>India</p>
            </div>
            <div className="contact-card">
              <Phone size={40} />
              <h4>Call Us</h4>
              <p>Toll Free: 1800-123-4567</p>
              <p>Mobile: +91 80-1234-5678</p>
              <p>Mon–Sat: 9 AM – 8 PM</p>
            </div>
            <div className="contact-card">
              <Mail size={40} />
              <h4>Email Us</h4>
              <p>support@technest.com</p>
              <p>sales@technest.com</p>
              <p>Response within 24 hrs</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="about-section">
        <div className="container px-4 mx-auto">
          <div className="cta-section">
            <h2>Ready to Explore?</h2>
            <p>
              Browse our collection of 10,000+ genuine products and find your next
              favourite tech gadget today.
            </p>
            <a href="/products" className="cta-button">
              Shop Now →
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;