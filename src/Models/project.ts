import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    description: { type: String, required: true },
    location: { type: String, required: true },
    harvestTime: { type: String, required: true },
    price: { type: String, required: true },
    contact: { type: String, required: true },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
