const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        name: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true
        },
        image: {
          type: String,
          default: ''
        }
      }
    ],

    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true, default: 'India' }
    },

    // ✅ Fixed: Accept all formats frontend might send
    paymentMethod: {
      type: String,
      required: true,
      // Normalize to lowercase before saving
      set: (val) => val ? val.toLowerCase() : val,
      enum: {
        values: ['card', 'upi', 'cod', 'paypal', 'netbanking'],
        message: 'Invalid payment method: {VALUE}'
      }
    },

    paymentResult: {
      id: { type: String, default: '' },
      status: { type: String, default: '' },
      update_time: { type: String, default: '' },
      email_address: { type: String, default: '' }
    },

    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0
    },

    taxPrice: {
      type: Number,
      required: true,
      default: 0.0
    },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0.0
    },

    isPaid: {
      type: Boolean,
      required: true,
      default: false
    },

    paidAt: {
      type: Date
    },

    isDelivered: {
      type: Boolean,
      required: true,
      default: false
    },

    deliveredAt: {
      type: Date
    },

    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    }
  },
  {
    timestamps: true  // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Order', orderSchema);