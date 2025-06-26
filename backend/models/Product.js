// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price']
  },
  image: {
    type: String,
    required: [true, 'Please provide a product image']
  },
  images: {
    type: [String],
    default: function() {
      return this.image ? [this.image] : [];
    }
  },
  category: {
    type: String,
    required: [true, 'Please provide a product category'],
    enum: ['eyeglasses', 'sunglasses', 'screen', 'power']
  },
  about: {
    type: String,
    required: [true, 'Please provide product details']
  },
  productId: {
    type: String,
    required: [true, 'Please provide product ID'],
    unique: true
  },
  frameStyle: {
    type: String,
    required: [true, 'Please provide frame style']
  },
  modelNo: {
    type: String,
    required: [true, 'Please provide model number']
  },
  frameWidth: {
    type: String,
    required: [true, 'Please provide frame width']
  },
  frameDimensions: {
    type: String,
    required: [true, 'Please provide frame dimensions']
  },
  frameColour: {
    type: String,
    required: [true, 'Please provide frame colour']
  },
  weight: {
    type: String,
    required: [true, 'Please provide weight']
  },
  weightGroup: {
    type: String,
    required: [true, 'Please provide weight group']
  },
  material: {
    type: String,
    required: [true, 'Please provide material']
  },
  frameMaterial: {
    type: String,
    required: [true, 'Please provide frame material']
  },
  templeMaterial: {
    type: String,
    required: [true, 'Please provide temple material']
  },
  prescriptionType: {
    type: String,
    required: [true, 'Please provide prescription type']
  },
  visionType: {
    type: String,
    required: [true, 'Please provide vision type']
  },
  frameStyleSecondary: {
    type: String,
    required: [true, 'Please provide secondary frame style']
  },
  collection: {
    type: String,
    required: [true, 'Please provide collection name']
  },
  warranty: {
    type: String,
    required: [true, 'Please provide warranty details']
  },
  gender: {
    type: String,
    required: [true, 'Please provide gender']
  },
  height: {
    type: String,
    required: [true, 'Please provide height']
  },
  condition: {
    type: String,
    required: [true, 'Please provide condition']
  },
  templeColour: {
    type: String,
    required: [true, 'Please provide temple colour']
  },
  brandName: {
    type: String,
    required: [true, 'Please provide brand name']
  },
  productType: {
    type: String,
    required: [true, 'Please provide product type']
  },
  frameType: {
    type: String,
    required: [true, 'Please provide frame type']
  },
  frameShape: {
    type: String,
    required: [true, 'Please provide frame shape']
  }
}, {
  timestamps: true
});

productSchema.pre('save', function(next) {
  if (!this.images || this.images.length === 0) {
    this.images = this.image ? [this.image] : [];
  }
  next();
});

productSchema.virtual('imageURL').get(function() {
  return `${process.env.BASE_URL}/uploads/products/${this.images[0] || this.image}`;
});

productSchema.virtual('primaryImage').get(function() {
  return this.images && this.images.length > 0 ? this.images[0] : this.image;
});

productSchema.index({ name: 'text', description: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;