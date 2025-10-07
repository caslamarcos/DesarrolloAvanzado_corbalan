import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: String,
  code: { type: String, unique: true, required: true },
  price: { type: Number, required: true, index: true },
  status: { type: Boolean, default: true, index: true }, // disponibilidad
  stock: { type: Number, default: 0 },
  category: { type: String, index: true },
  thumbnails: [String]
}, { timestamps: true });

productSchema.plugin(paginate);

export const Product = mongoose.model('Product', productSchema);