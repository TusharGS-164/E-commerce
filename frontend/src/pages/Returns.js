import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw,  Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import './Returns.css';

const Returns = () => {
  return (
    <div className="returns-page">
      {/* Hero */}
      <section className="returns-hero">
        <div className="container">
          <RefreshCw size={60} className="hero-icon" />
          <h1>Returns & Refunds Policy</h1>
          <p>Easy 30-day returns with hassle-free refunds</p>
        </div>
      </section>

      <div className="container">
        {/* Quick Summary */}
        <section className="quick-summary">
          <div className="summary-cards">
            <div className="summary-card">
              <Clock size={40} />
              <h3>30 Days</h3>
              <p>Return window from delivery</p>
            </div>
            <div className="summary-card">
              <Truck size={40} />
              <h3>Free Pickup</h3>
              <p>We arrange pickup at no cost</p>
            </div>
            <div className="summary-card">
              <CheckCircle size={40} />
              <h3>Full Refund</h3>
              <p>Get 100% money back</p>
            </div>
            <div className="summary-card">
              <RefreshCw size={40} />
              <h3>Easy Exchange</h3>
              <p>Swap for different item</p>
            </div>
          </div>
        </section>

        {/* Return Policy */}
        <section className="policy-section">
          <h2>Return Policy</h2>
          <div className="policy-content">
            <h3>30-Day Return Window</h3>
            <p>
              We offer a hassle-free 30-day return policy from the date of delivery. If you're not completely satisfied with your purchase, you can return it for a full refund or exchange it for a different product.
            </p>

            <h3>Eligibility Criteria</h3>
            <p>To be eligible for a return, your item must meet the following conditions:</p>
            <ul>
              <li>Product must be in unused, original condition</li>
              <li>Original packaging with all tags and labels intact</li>
              <li>All accessories, manuals, and warranty cards included</li>
              <li>Returned within 30 days of delivery</li>
              <li>No physical damage or alterations to the product</li>
            </ul>

            <h3>Non-Returnable Items</h3>
            <p>For hygiene and safety reasons, the following items cannot be returned:</p>
            <ul>
              <li>Earphones and headphones (if seal is broken)</li>
              <li>Personal care and grooming products (if opened)</li>
              <li>Software and downloadable products</li>
              <li>Gift cards and vouchers</li>
              <li>Customized or personalized products</li>
              <li>Products on clearance or final sale</li>
            </ul>
          </div>
        </section>

        {/* How to Return */}
        <section className="policy-section">
          <h2>How to Return a Product</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Initiate Return</h3>
              <p>Log into your account, go to "My Orders", select the order you want to return, and click the "Return" button.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Select Reason</h3>
              <p>Choose the reason for return from the dropdown menu. This helps us improve our service and product quality.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Schedule Pickup</h3>
              <p>We'll arrange a free pickup from your address. Select a convenient date and time slot for the pickup.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Pack the Item</h3>
              <p>Pack the product securely in its original packaging with all accessories, manuals, and warranty cards.</p>
            </div>
            <div className="step-card">
              <div className="step-number">5</div>
              <h3>Handover to Courier</h3>
              <p>Our delivery partner will pick up the package. Make sure to get a pickup receipt for your records.</p>
            </div>
            <div className="step-card">
              <div className="step-number">6</div>
              <h3>Get Refund</h3>
              <p>Once we receive and verify the product, your refund will be processed within 5-7 business days.</p>
            </div>
          </div>
        </section>

        {/* Refund Process */}
        <section className="policy-section">
          <h2>Refund Process</h2>
          <div className="policy-content">
            <h3>Refund Timeline</h3>
            <p>
              After we receive your returned product, our quality team will inspect it within 2-3 business days. Once approved, your refund will be initiated and processed within 5-7 business days to your original payment method.
            </p>

            <h3>Refund Method</h3>
            <table className="refund-table">
              <thead>
                <tr>
                  <th>Payment Method</th>
                  <th>Refund To</th>
                  <th>Processing Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Credit/Debit Card</td>
                  <td>Same Card</td>
                  <td>5-7 business days</td>
                </tr>
                <tr>
                  <td>UPI/Net Banking</td>
                  <td>Source Account</td>
                  <td>2-3 business days</td>
                </tr>
                <tr>
                  <td>Cash on Delivery</td>
                  <td>Bank Transfer</td>
                  <td>7-10 business days</td>
                </tr>
                <tr>
                  <td>Wallet</td>
                  <td>TechStore Wallet</td>
                  <td>Instant</td>
                </tr>
              </tbody>
            </table>

            <h3>Partial Refunds</h3>
            <p>Partial refunds may be granted in the following situations:</p>
            <ul>
              <li>Product shows signs of use or wear</li>
              <li>Missing accessories or components (prorated refund)</li>
              <li>Damaged packaging or missing original packaging</li>
              <li>Product returned after 30 days but within 90 days (store credit only)</li>
            </ul>
          </div>
        </section>

        {/* Exchange Policy */}
        <section className="policy-section">
          <h2>Exchange Policy</h2>
          <div className="policy-content">
            <h3>Exchange Process</h3>
            <p>
              You can exchange a product within 30 days if you want a different size, color, or model. Exchanges are subject to product availability. The exchange process is similar to returns:
            </p>
            <ol>
              <li>Initiate exchange request from "My Orders"</li>
              <li>Select the product you want instead</li>
              <li>We'll arrange pickup of old product and delivery of new product</li>
              <li>Both happen simultaneously at no extra cost</li>
            </ol>

            <h3>Price Difference</h3>
            <ul>
              <li>If new product costs more: Pay the difference online</li>
              <li>If new product costs less: Get refund of the difference</li>
              <li>Exchange delivery is free</li>
            </ul>
          </div>
        </section>

        {/* Special Cases */}
        <section className="policy-section">
          <h2>Special Cases</h2>
          <div className="policy-content">
            <h3>Damaged or Defective Products</h3>
            <p>
              If you receive a damaged or defective product, please contact us within 48 hours of delivery with photos. We'll arrange an immediate replacement at no cost, or issue a full refund including shipping charges.
            </p>

            <h3>Wrong Product Delivered</h3>
            <p>
              If you receive the wrong product, please contact us immediately. We'll arrange pickup of the incorrect item and deliver the correct product at no additional cost. You'll also receive a gift voucher for the inconvenience.
            </p>

            <h3>Missing Items</h3>
            <p>
              If any items or accessories are missing from your order, report it within 48 hours. We'll either ship the missing items or issue a partial refund based on your preference.
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="policy-section">
          <h2>Return FAQs</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h4>Can I return a product purchased during a sale?</h4>
              <p>Yes, our return policy applies to all products including sale items, unless specifically marked as "Final Sale" or "Non-Returnable".</p>
            </div>
            <div className="faq-item">
              <h4>Do I need the original invoice to return a product?</h4>
              <p>No, the original invoice is not mandatory. Your order details in your account are sufficient for returns.</p>
            </div>
            <div className="faq-item">
              <h4>What if the return pickup fails?</h4>
              <p>We'll automatically reschedule the pickup for the next available slot. You can also reschedule from your account.</p>
            </div>
            <div className="faq-item">
              <h4>Can I track my return?</h4>
              <p>Yes, you can track your return status in the "My Orders" section. You'll also receive email and SMS updates.</p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="contact-cta">
          <div className="cta-content">
            <AlertCircle size={50} />
            <h2>Need Help with a Return?</h2>
            <p>Our customer support team is here to assist you</p>
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

export default Returns;