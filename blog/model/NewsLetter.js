import mongoose from 'mongoose';

const NewsLetter = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

export default mongoose.models.NewsLetter || mongoose.model('NewsLetter', NewsLetter);