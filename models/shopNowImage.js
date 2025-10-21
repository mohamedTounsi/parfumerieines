// models/shopNowImage.js
import mongoose from 'mongoose';

const ShopNowImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
});

const ShopNowImage = mongoose.models.ShopNowImage || mongoose.model('ShopNowImage', ShopNowImageSchema);

export default ShopNowImage;
