// models/hero.js
import mongoose from 'mongoose';

const HeroSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  }
});

const HeroImage = mongoose.models.Hero || mongoose.model("Hero", HeroSchema);

export default HeroImage;
