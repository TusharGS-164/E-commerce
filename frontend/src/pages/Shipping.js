import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Package, MapPin, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import './Returns.css';

const Shipping = () => {
  return (
    <div className="shipping-page">
      {/* Hero */}
      <section className="shipping-hero">
        <div className="container">
          <Truck size={60} className="hero-icon" />
          <h1>Shipping & Delivery Policy</h1>
          <p>Fast, reliable delivery across India with real-time tracking</p>
        </div>
      </section>

      <div className="container">
        {/* Quick Summary */}
        <section className="quick-summary">
          <div className="summary-cards">
            <div className="summary-card">
              <Package size={40} />
              <h3>Free Shipping</h3>
              <p>On orders above ₹50</p>
            </div>
            <div className="summary-card">
              <Truck size={40} />
              <h3>3-5 Days</h3>
              <p>Standard delivery time</p>
            </div>
            <div className="summary-card">
              <MapPin size={40} />
              <h3>Pan India</h3>
              <p>Delivery across all states</p>
            </div>
            <div className="summary-card">
              <Clock size={40} />
              <h3>Express Option</h3>
              <p>1-2 day delivery available</p>
            </div>
          </div>
        </section>

        {/* Shipping Charges */}
        <section className="policy-section">
          <h2>Shipping Charges</h2>
          <div className="policy-content">
            <h3>Standard Shipping</h3>
            <table className="shipping-table">
              <thead>
                <tr>
                  <th>Order Value</th>
                  <th>Shipping Charge</th>
                  <th>Delivery Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Above ₹50</td>
                  <td><strong style={{color: '#4caf50'}}>FREE</strong></td>
                  <td>3-5 business days</td>
                </tr>
                <tr>
                  <td>Below ₹50</td>
                  <td>₹10</td>
                  <td>3-5 business days</td>
                </tr>
                <tr>
                  <td>Any Order (Express)</td>
                  <td>₹20</td>
                  <td>1-2 business days</td>
                </tr>
              </tbody>
            </table>

            <div className="info-box">
              <CheckCircle size={24} />
              <p>
                <strong>Free Shipping Tip:</strong> Add items worth ₹50 or more to your cart to qualify for free standard shipping anywhere in India!
              </p>
            </div>

            <h3>International Shipping</h3>
            <p>
              We currently ship only within India. International shipping is not available at this time. 
              We're working on expanding our services globally. Subscribe to our newsletter to be notified when we start shipping internationally.
            </p>
          </div>
        </section>

        {/* Delivery Zones */}
        <section className="policy-section">
          <h2>Delivery Zones & Timeline</h2>
          <div className="zone-cards">
            <div className="zone-card">
              <h4>🏙️ Metro Cities</h4>
              <p><strong>Cities:</strong> Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad</p>
              <p><strong>Standard:</strong> 2-3 business days</p>
              <p><strong>Express:</strong> 1 business day</p>
            </div>
            <div className="zone-card">
              <h4>🏘️ Tier 1 & 2 Cities</h4>
              <p><strong>Coverage:</strong> Major cities and state capitals</p>
              <p><strong>Standard:</strong> 3-5 business days</p>
              <p><strong>Express:</strong> 2 business days</p>
            </div>
            <div className="zone-card">
              <h4>🏞️ Tier 3 & Remote Areas</h4>
              <p><strong>Coverage:</strong> Towns and rural areas</p>
              <p><strong>Standard:</strong> 5-7 business days</p>
              <p><strong>Express:</strong> Not available</p>
            </div>
          </div>

          <div className="warning-box">
            <AlertTriangle size={24} />
            <p>
              <strong>Note:</strong> Delivery times are estimates and may vary due to factors beyond our control such as natural disasters, political unrest, customs delays, or courier issues. We're not liable for delays caused by such circumstances.
            </p>
          </div>
        </section>

        {/* Order Processing */}
        <section className="policy-section">
          <h2>Order Processing & Dispatch</h2>
          <div className="policy-content">
            <h3>Processing Time</h3>
            <ul>
              <li>Orders placed before 3:00 PM IST are processed the same day</li>
              <li>Orders placed after 3:00 PM IST are processed the next business day</li>
              <li>Orders placed on weekends/holidays are processed on the next business day</li>
              <li>Pre-order items are dispatched on the mentioned release date</li>
              <li>Large appliances may require 1-2 additional days for processing</li>
            </ul>

            <h3>Tracking Your Order</h3>
            <p>
              Once your order is shipped, you'll receive a shipping confirmation email and SMS with your tracking number. 
              You can track your order in real-time by:
            </p>
            <ol>
              <li>Logging into your account and visiting "My Orders"</li>
              <li>Clicking the tracking link in your shipping confirmation email</li>
              <li>Entering your tracking number on the courier's website</li>
              <li>Contacting our customer support with your order number</li>
            </ol>

            <h3>Multiple Item Orders</h3>
            <p>
              If you order multiple items, they may be shipped separately based on availability and warehouse location. 
              You'll receive separate tracking numbers for each shipment. There's no extra shipping charge for split shipments.
            </p>
          </div>
        </section>

        {/* Delivery Process */}
        <section className="policy-section">
          <h2>Delivery Process</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Order Placed</h3>
              <p>You receive an order confirmation email immediately after placing your order.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Order Processed</h3>
              <p>Your order is picked, packed, and quality-checked at our warehouse within 24 hours.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Shipped</h3>
              <p>Your order is handed over to our delivery partner and you receive a tracking number.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>In Transit</h3>
              <p>Your order is on its way! Track it in real-time using the tracking link.</p>
            </div>
            <div className="step-card">
              <div className="step-number">5</div>
              <h3>Out for Delivery</h3>
              <p>Your order has reached your city and will be delivered the same day.</p>
            </div>
            <div className="step-card">
              <div className="step-number">6</div>
              <h3>Delivered</h3>
              <p>Enjoy your purchase! Don't forget to leave a review and share your experience.</p>
            </div>
          </div>
        </section>

        {/* Delivery Policies */}
        <section className="policy-section">
          <h2>Delivery Policies</h2>
          <div className="policy-content">
            <h3>Delivery Attempts</h3>
            <p>
              Our delivery partner will make up to 2 delivery attempts. If both attempts fail, the package will be 
              held at the local courier office for 3 days. You'll receive notifications after each failed attempt 
              with instructions to reschedule delivery or arrange for self-pickup.
            </p>

            <h3>Signature Required</h3>
            <p>
              For orders above ₹5,000, delivery requires a signature. For contactless delivery, you can authorize 
              the courier to leave the package at your doorstep by updating delivery instructions in your account.
            </p>

            <h3>Address Change</h3>
            <p>
              You can change the delivery address before the order is shipped by contacting customer support. 
              Once shipped, address changes are not possible, but you can arrange re-delivery to a different 
              address through the courier.
            </p>

            <h3>PO Box Delivery</h3>
            <p>
              We do not deliver to PO boxes. Please provide a complete physical address where someone can 
              receive the package during business hours.
            </p>

            <h3>Unattended Delivery</h3>
            <p>
              If you won't be home, you can authorize leaving the package with a neighbor or at a safe location. 
              Please note that once you authorize unattended delivery, we're not responsible for lost or stolen packages.
            </p>
          </div>
        </section>

        {/* Installation Services */}
        <section className="policy-section">
          <h2>Installation Services</h2>
          <div className="policy-content">
            <h3>Free Installation</h3>
            <p>
              We offer complimentary basic installation for the following products:
            </p>
            <ul>
              <li>Televisions (wall mounting not included)</li>
              <li>Washing machines (standard installation only)</li>
              <li>Refrigerators (placement and leveling)</li>
              <li>Microwave ovens (tabletop placement)</li>
            </ul>

            <h3>Paid Installation</h3>
            <p>
              Advanced installation services are available at additional cost:
            </p>
            <ul>
              <li>TV wall mounting: ₹500 - ₹1,500 (based on TV size)</li>
              <li>Air conditioner installation: ₹1,000 - ₹2,000</li>
              <li>Water purifier installation: ₹500</li>
              <li>Home theater setup: ₹800 - ₹1,500</li>
            </ul>

            <p>
              Installation charges are collected by the technician in cash after successful installation. 
              You can add installation service during checkout or contact us within 7 days of delivery.
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="policy-section">
          <h2>Shipping FAQs</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h4>Can I change my shipping address after placing an order?</h4>
              <p>Yes, but only before the order is shipped. Contact customer support immediately with your order number and new address.</p>
            </div>
            <div className="faq-item">
              <h4>What if I'm not home during delivery?</h4>
              <p>The courier will attempt delivery twice. You can also reschedule delivery or authorize leaving the package at a safe location.</p>
            </div>
            <div className="faq-item">
              <h4>Do you deliver on weekends and holidays?</h4>
              <p>Yes, we deliver 6 days a week (Monday to Saturday). Sunday deliveries are available in select metro cities for an additional charge.</p>
            </div>
            <div className="faq-item">
              <h4>How do I track my order?</h4>
              <p>You'll receive a tracking number via email and SMS once your order ships. Use this to track your package in real-time.</p>
            </div>
            <div className="faq-item">
              <h4>What if my package is delayed?</h4>
              <p>Contact our support team if your package doesn't arrive within the estimated delivery time. We'll investigate and provide updates.</p>
            </div>
            <div className="faq-item">
              <h4>Can I expedite my order after placing it?</h4>
              <p>Yes, you can upgrade to express shipping if your order hasn't shipped yet. Contact support to arrange this for a ₹20 fee.</p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="contact-cta">
          <div className="cta-content">
            <Package size={50} />
            <h2>Questions About Shipping?</h2>
            <p>Our customer support team is here to help</p>
            <div className="cta-buttons">
              <Link to="/contact" className="cta-btn primary">Contact Support</Link>
              <Link to="/faq" className="cta-btn secondary">View FAQs</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Shipping;