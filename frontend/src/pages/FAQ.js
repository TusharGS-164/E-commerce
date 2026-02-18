import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      category: 'Orders & Payment',
      icon: '🛒',
      questions: [
        {
          question: 'How do I place an order?',
          answer: 'To place an order, browse our products, add items to your cart, and proceed to checkout. You\'ll need to create an account or log in, provide shipping details, and complete the payment. You\'ll receive an order confirmation email immediately after purchase.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept Credit/Debit Cards (Visa, Mastercard, Rupay, Amex), UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking (all major Indian banks), and Cash on Delivery (COD) for eligible orders. All online payments are processed securely through Razorpay.'
        },
        {
          question: 'Is it safe to use my credit card on your website?',
          answer: 'Yes, absolutely! We use industry-standard SSL encryption and process all payments through Razorpay, a PCI DSS compliant payment gateway. We never store your card details on our servers. Your payment information is completely secure.'
        },
        {
          question: 'Can I cancel or modify my order?',
          answer: 'You can cancel or modify your order within 1 hour of placing it by contacting our customer support. After this time, if the order has been processed, you may need to wait for delivery and then initiate a return instead.'
        },
        {
          question: 'Do you offer EMI options?',
          answer: 'Yes, we offer EMI options on credit cards for orders above ₹5,000. You can choose from 3, 6, 9, or 12-month EMI plans. Some banks also offer zero-cost EMI. The EMI option will be available at checkout.'
        }
      ]
    },
    {
      category: 'Shipping & Delivery',
      icon: '🚚',
      questions: [
        {
          question: 'How long will delivery take?',
          answer: 'Standard delivery takes 3-5 business days for most locations in India. Metro cities usually receive orders within 2-3 days. Express shipping (1-2 days) is available at checkout for an additional fee. Remote areas may take 5-7 days.'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Currently, we only ship within India. We\'re working on expanding our international shipping soon. Please subscribe to our newsletter to be notified when international shipping becomes available.'
        },
        {
          question: 'What are the shipping charges?',
          answer: 'We offer FREE shipping on all orders above ₹50. For orders below ₹50, a flat shipping fee of ₹10 applies. Express shipping is available for ₹20 extra. Shipping costs are calculated at checkout based on your location.'
        },
        {
          question: 'How can I track my order?',
          answer: 'Once your order ships, you\'ll receive a tracking number via email and SMS. You can track your order in real-time by logging into your account and visiting the "My Orders" section. The tracking link will also show the estimated delivery date.'
        },
        {
          question: 'What if I\'m not home during delivery?',
          answer: 'Our delivery partner will attempt delivery twice. If both attempts fail, the package will be held at the local courier office for 3 days. You\'ll receive SMS notifications with instructions to reschedule delivery or arrange pickup.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      icon: '↩️',
      questions: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a hassle-free 30-day return policy. If you\'re not satisfied with your purchase, you can return it within 30 days of delivery for a full refund. The product must be unused, in original packaging with all accessories and tags intact.'
        },
        {
          question: 'How do I return a product?',
          answer: 'Log into your account, go to "My Orders", select the order you want to return, and click "Return Item". Choose the reason for return, and we\'ll arrange a free pickup. Once we receive and verify the product, your refund will be processed within 5-7 business days.'
        },
        {
          question: 'When will I get my refund?',
          answer: 'Refunds are processed within 5-7 business days after we receive and verify the returned product. The amount will be credited to your original payment method. For UPI/Net Banking, it may take 2-3 days to reflect in your account. For COD orders, we\'ll process a bank transfer.'
        },
        {
          question: 'Can I exchange a product?',
          answer: 'Yes, you can exchange products within 30 days if you want a different size, color, or model. The exchange is subject to availability. Initiate the exchange from your account, and we\'ll arrange pickup of the old product and delivery of the new one simultaneously.'
        },
        {
          question: 'Are there any items that cannot be returned?',
          answer: 'For hygiene reasons, earphones, headphones, personal care items, and software cannot be returned if the packaging seal is broken. Gift cards, downloadable software, and customized products are also non-returnable. All other products are eligible for return.'
        }
      ]
    },
    {
      category: 'Products & Warranty',
      icon: '📦',
      questions: [
        {
          question: 'Are all products genuine?',
          answer: 'Yes, 100%! We only source products directly from authorized distributors and manufacturers. Every product comes with an official manufacturer warranty card and authenticity certificate. We guarantee all products are genuine and brand new.'
        },
        {
          question: 'What warranty do you offer?',
          answer: 'All products come with the manufacturer\'s warranty ranging from 6 months to 3 years depending on the product. Additionally, we offer an extended warranty option at checkout. Warranty terms and conditions vary by brand and product category.'
        },
        {
          question: 'What if I receive a damaged or defective product?',
          answer: 'We\'re sorry if this happens! Please contact us within 48 hours of delivery with photos of the damage. We\'ll arrange an immediate replacement at no extra cost. For defective products, we offer a free replacement or full refund based on your preference.'
        },
        {
          question: 'Do you offer product installation services?',
          answer: 'Yes, we offer professional installation services for TVs, air conditioners, washing machines, and other large appliances. Installation charges vary by product and location. You can add installation service during checkout or contact us after purchase.'
        },
        {
          question: 'Can I pre-order upcoming products?',
          answer: 'Yes, we offer pre-orders for highly anticipated product launches. Pre-order products are marked with a "Pre-Order" badge. You\'ll need to pay in advance, and the product will be shipped as soon as it\'s available, usually within the timeframe mentioned on the product page.'
        }
      ]
    },
    {
      category: 'Account & Security',
      icon: '👤',
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'Click "Sign Up" in the top menu, enter your name, email, and password. You\'ll receive a verification email - click the link to activate your account. You can also sign up using Google or Facebook for faster registration.'
        },
        {
          question: 'I forgot my password. What should I do?',
          answer: 'Click "Login" and then "Forgot Password". Enter your registered email address, and we\'ll send you a password reset link. The link is valid for 24 hours. If you don\'t receive the email, check your spam folder or contact support.'
        },
        {
          question: 'How do I change my email or phone number?',
          answer: 'Log into your account, go to "Profile" or "Account Settings", and you can update your email and phone number. For email changes, you\'ll need to verify the new email address. Phone number changes require OTP verification for security.'
        },
        {
          question: 'Is my personal information safe?',
          answer: 'Absolutely! We use industry-standard encryption to protect your data. Your personal information is never shared with third parties without your consent. We comply with all data protection regulations. Read our Privacy Policy for complete details.'
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, you can permanently delete your account from Account Settings. Please note that this action is irreversible and will delete all your order history, saved addresses, and wishlist. Active orders must be completed or cancelled before account deletion.'
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="faq-page">
      {/* Hero Section */}
      <section className="faq-hero">
        <div className="container">
          <HelpCircle size={60} className="hero-icon" />
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about our products and services</p>
        </div>
      </section>

      <div className="container">
        {/* Search Bar */}
        <div className="faq-search">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="faq-content">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="faq-category">
                <h2 className="category-title">
                  <span className="category-icon">{category.icon}</span>
                  {category.category}
                </h2>
                <div className="questions-list">
                  {category.questions.map((item, questionIndex) => {
                    const index = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openIndex === index;

                    return (
                      <div
                        key={questionIndex}
                        className={`question-item ${isOpen ? 'open' : ''}`}
                      >
                        <button
                          className="question-btn"
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        >
                          <span className="question-text">{item.question}</span>
                          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {isOpen && (
                          <div className="answer-content">
                            <p>{item.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <HelpCircle size={60} />
              <h3>No results found</h3>
              <p>Try searching with different keywords</p>
            </div>
          )}
        </div>

        {/* Still Need Help */}
        <div className="help-cta">
          <h2>Still Need Help?</h2>
          <p>Can't find the answer you're looking for? Our customer support team is here to help!</p>
          <div className="help-options">
            <a href="/contact" className="help-option">
              <div className="help-icon">📧</div>
              <h4>Email Us</h4>
              <p>support@techstore.com</p>
            </a>
            <a href="tel:18001234567" className="help-option">
              <div className="help-icon">📞</div>
              <h4>Call Us</h4>
              <p>1800-123-4567</p>
            </a>
            <a href="https://wa.me/919876543210" className="help-option" target="_blank" rel="noopener noreferrer">
              <div className="help-icon">💬</div>
              <h4>WhatsApp</h4>
              <p>Chat with us</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;