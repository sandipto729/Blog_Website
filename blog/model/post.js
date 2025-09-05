import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    profilePicture: {
      type: String,
      default: ''
    }
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
}, { timestamps: true })

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true, // stores HTML
  },
  excerpt: {
    type: String,
    maxlength: 500
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['general', 'technology', 'lifestyle', 'travel', 'food', 'health', 'business'],
    default: 'general'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  published: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  readTime: {
    type: Number
  },
  seoTitle: {
    type: String,
    maxlength: 60
  },
  seoDescription: {
    type: String,
    maxlength: 160
  }
}, { timestamps: true })

// Pre-save middleware
postSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now()
  }

  if (this.isModified('content')) {
    const textContent = this.content.replace(/<[^>]*>/g, '')
    this.excerpt = textContent.substring(0, 200) + (textContent.length > 200 ? '...' : '')

    const wordCount = textContent.split(/\s+/).filter(Boolean).length
    this.readTime = Math.ceil(wordCount / 200)
  }
  next()
})

// Indexes
postSchema.index({ title: 'text', content: 'text', tags: 'text' })
postSchema.index({ createdAt: -1 })
postSchema.index({ category: 1 })
postSchema.index({ author: 1 })

export default mongoose.models.Post || mongoose.model('Post', postSchema)
