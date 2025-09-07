'use server'

async function handleContactSubmission(formData) {
  
  const sendEmail = require('../../../lib/mail');
  const websiteUrl = process.env.WEBSITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  const name = formData.get('name');
  const email = formData.get('email');
  const subject = formData.get('subject');
  const message = formData.get('message');
  
  // Email to the user (confirmation)
  const userEmailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px; }
        .thank-you { color: #667eea; font-size: 18px; font-weight: bold; margin-bottom: 15px; }
        .message-box { background: #f8fafc; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        .footer a { color: #667eea; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📝 BlogSpace</h1>
          <p>Thank you for contacting us!</p>
        </div>
        <div class="content">
          <p class="thank-you">Hi ${name},</p>
          <p>Thank you for reaching out to us! We have received your message and will get back to you as soon as possible.</p>
          
          <div class="message-box">
            <h3>Your Message Summary:</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p>Our typical response times:</p>
          <ul>
            <li>General inquiries: 24-48 hours</li>
            <li>Technical support: 12-24 hours</li>
            <li>Bug reports: 2-4 hours</li>
            <li>Partnership requests: 3-5 business days</li>
          </ul>
          
          <p>Best regards,<br>The BlogSpace Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p><a href="${websiteUrl}">Visit BlogSpace</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Email to admin (notification with table format)
  const adminEmailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px; }
        .alert { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f8fafc; font-weight: bold; color: #333; }
        .message-content { max-width: 300px; word-wrap: break-word; }
        .priority { background: #dc3545; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px; }
        .timestamp { color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 New Contact Form Submission</h1>
          <p>BlogSpace Contact Form</p>
        </div>
        <div class="content">
          <div class="alert">
            <strong>New message received!</strong> Please respond according to the response time guidelines.
          </div>
          
          <table>
            <tr>
              <th>Field</th>
              <th>Details</th>
            </tr>
            <tr>
              <td><strong>👤 Name</strong></td>
              <td>${name}</td>
            </tr>
            <tr>
              <td><strong>📧 Email</strong></td>
              <td><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td><strong>📋 Subject</strong></td>
              <td><span class="priority">${subject.toUpperCase()}</span></td>
            </tr>
            <tr>
              <td><strong>💬 Message</strong></td>
              <td class="message-content">${message.replace(/\n/g, '<br>')}</td>
            </tr>
            <tr>
              <td><strong>⏰ Received At</strong></td>
              <td class="timestamp">${new Date().toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>🌐 User IP</strong></td>
              <td>Unknown (Server-side form)</td>
            </tr>
          </table>
          
          <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 5px;">
            <h3>📊 Response Guidelines:</h3>
            <ul>
              <li><strong>General inquiries:</strong> 24-48 hours</li>
              <li><strong>Technical support:</strong> 12-24 hours</li>
              <li><strong>Bug reports:</strong> 2-4 hours (HIGH PRIORITY)</li>
              <li><strong>Partnership requests:</strong> 3-5 business days</li>
            </ul>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <a href="mailto:${email}" style="background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">Reply to ${name}</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  try {
    // Send confirmation email to user
    await sendEmail(
      email,
      `Thank you for contacting BlogSpace - We've received your message`,
      userEmailHTML
    );
    
    // Send notification email to admin
    await sendEmail(
      'sandipto729@gmail.com',
      `🚨 New Contact Form: ${subject} from ${name}`,
      adminEmailHTML
    );
    
    return { success: true, message: 'Emails sent successfully!' };
  } catch (error) {
    console.error('Error sending emails:', error);
    return { success: false, message: 'Failed to send emails. Please try again.' };
  }
}

export { handleContactSubmission };