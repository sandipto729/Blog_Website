'use server'
import connectDB from "@/lib/mongo";
import NewLetterModel from "@/model/NewsLetter";

export async function handleNewsLetter(formData) {
  const sendEmail = require('@/lib/mail');
  
  const email = formData.get('email');
  const websiteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  if (!email || !email.trim()) {
    return { success: false, message: 'Email is required' };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { success: false, message: 'Please enter a valid email address' };
  }

  try {
    await connectDB();
    
    // Check if email already exists
    const existingSubscriber = await NewLetterModel.findOne({ email: email.trim().toLowerCase() });
    if (existingSubscriber) {
      return { success: false, message: 'Email is already subscribed to our newsletter' };
    }

    // Create new subscriber
    const newSubscriber = new NewLetterModel({ 
      email: email.trim().toLowerCase() 
    });
    
    await newSubscriber.save();
    
    // Send welcome email to new subscriber
    const welcomeEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; position: relative; }
          .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="white" opacity="0.1"><polygon points="1000,100 1000,0 0,100"/></svg>'); }
          .header h1 { margin: 0; font-size: 32px; font-weight: 700; position: relative; z-index: 1; }
          .header p { margin: 10px 0 0 0; font-size: 18px; opacity: 0.9; position: relative; z-index: 1; }
          .content { padding: 40px 30px; }
          .welcome-badge { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 12px 24px; border-radius: 25px; display: inline-block; font-weight: 600; font-size: 16px; margin-bottom: 20px; }
          .message { font-size: 18px; line-height: 1.6; color: #2d3748; margin-bottom: 30px; }
          .benefits { background: #f7fafc; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #667eea; }
          .benefits h3 { margin: 0 0 15px 0; color: #667eea; font-size: 20px; }
          .benefits ul { margin: 0; padding-left: 20px; }
          .benefits li { margin-bottom: 8px; color: #4a5568; }
          .cta-section { text-align: center; margin: 30px 0; }
          .cta-button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; transition: transform 0.2s; }
          .cta-button:hover { transform: translateY(-2px); }
          .social-section { text-align: center; margin: 30px 0; }
          .social-links { margin-top: 15px; }
          .social-links a { display: inline-block; margin: 0 10px; padding: 10px; background: #f1f5f9; border-radius: 50%; text-decoration: none; font-size: 20px; transition: background 0.2s; }
          .social-links a:hover { background: #e2e8f0; }
          .footer { background: #f8fafc; padding: 25px 30px; text-align: center; color: #718096; font-size: 14px; border-top: 1px solid #e2e8f0; }
          .footer a { color: #667eea; text-decoration: none; }
          .unsubscribe { margin-top: 15px; font-size: 12px; color: #a0aec0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to BlogSpace!</h1>
            <p>You're now part of our amazing community</p>
          </div>
          
          <div class="content">
            <div class="welcome-badge">✨ Welcome Aboard!</div>
            
            <div class="message">
              <p>Hi there!</p>
              <p>Thank you for subscribing to the <strong>BlogSpace Newsletter</strong>! We're thrilled to have you join our community of passionate readers and writers.</p>
            </div>

            <div class="benefits">
              <h3>🚀 What you can expect:</h3>
              <ul>
                <li>🔥 <strong>Latest Blog Posts:</strong> Get notified about fresh content first</li>
                <li>💡 <strong>Exclusive Tips:</strong> Writing and tech insights from our community</li>
                <li>📈 <strong>Weekly Roundups:</strong> Best posts and trending topics</li>
                <li>🎁 <strong>Special Content:</strong> Subscriber-only articles and resources</li>
                <li>⚡ <strong>Real-time Updates:</strong> New features and platform improvements</li>
              </ul>
            </div>

            <div class="cta-section">
              <a href="${websiteUrl}" class="cta-button">
                🏠 Explore BlogSpace
              </a>
            </div>

            <div class="social-section">
              <p><strong>Follow us on social media for more updates:</strong></p>
              <div class="social-links">
                <a href="#" title="Twitter">🐦</a>
                <a href="#" title="LinkedIn">💼</a>
                <a href="#" title="GitHub">🐙</a>
                <a href="#" title="Discord">🎮</a>
              </div>
            </div>

            <div class="message">
              <p>Have questions or feedback? Just reply to this email - we'd love to hear from you!</p>
              <p>Happy reading! 📚</p>
              <p><strong>The BlogSpace Team</strong></p>
            </div>
          </div>

          <div class="footer">
            <p>You're receiving this email because you subscribed to BlogSpace newsletter.</p>
            <p><a href="${websiteUrl}">Visit BlogSpace</a> | <a href="mailto:sandipto729@gmail.com">Contact Us</a></p>
            <div class="unsubscribe">
              <p>Don't want to receive these emails? <a href="#" style="color: #a0aec0;">Unsubscribe here</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send welcome email
    await sendEmail(
      email.trim(),
      '🎉 Welcome to BlogSpace Newsletter!',
      welcomeEmailHTML
    );
    
    console.log(`✅ New newsletter subscriber: ${email} - Welcome email sent!`);
    return { success: true, message: 'Successfully subscribed! Check your email for a welcome message.' };
    
  } catch (error) {
    console.error('❌ Error in newsletter subscription:', error);
    
    // Handle duplicate key error (just in case)
    if (error.code === 11000 || error.message.includes('duplicate')) {
      return { success: false, message: 'Email is already subscribed to our newsletter' };
    }
    
    return { success: false, message: 'Failed to subscribe. Please try again later.' };
  }
}