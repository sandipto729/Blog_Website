'use client';
import React, { useEffect, useState } from 'react';
import styles from './contact.module.scss';
import toast from 'react-hot-toast';
import { handleContactSubmission } from './submitForm'; 

const ContactUs = () => {
  useEffect(() => {
    // Add dark background to body when component mounts
    document.body.style.background = 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)';
    document.body.style.minHeight = '100vh';
    
    // Clean up when component unmounts
    return () => {
      document.body.style.background = '';
      document.body.style.minHeight = '';
    };
  }, []);

  const handleSubmit = async (formData) => {
    const submitPromise = handleContactSubmission(formData);
    
    toast.promise(
      submitPromise,
      {
        loading: '📤 Sending your message...',
        success: (result) => {
          if (result.success) {
            // Reset form after successful submission
            setTimeout(() => {
              document.querySelector('form').reset();
            }, 100);
            return 'Message sent successfully! Check your email for confirmation.';
          } else {
            throw new Error(result.message);
          }
        },
        error: (err) => `❌ ${err.message || 'Failed to send message. Please try again.'}`,
      },
      {
        style: {
          minWidth: '300px',
          background: '#2d3748',
          color: '#f7fafc',
          border: '1px solid #4a5568',
        },
        success: {
          duration: 5000,
          iconTheme: {
            primary: '#48bb78',
            secondary: '#f7fafc',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#f56565',
            secondary: '#f7fafc',
          },
        },
        loading: {
          iconTheme: {
            primary: '#667eea',
            secondary: '#f7fafc',
          },
        },
      }
    );
  };

  return (
    <div className={styles.contactContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Get In Touch</h1>
        <p className={styles.subtitle}>
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className={styles.content}>
        {/* Contact Form */}
        <div className={styles.contactForm}>
          <h2 className={styles.sectionTitle}>Send us a Message</h2>
          
          <form action={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className={styles.input}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className={styles.input}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject" className={styles.label}>Subject</label>
              <select id="subject" name="subject" className={styles.select} required>
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feedback">Feedback</option>
                <option value="partnership">Partnership</option>
                <option value="bug-report">Bug Report</option>
                <option value="feature-request">Feature Request</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="6"
                className={styles.textarea}
                placeholder="Tell us more about your inquiry..."
                required
              ></textarea>
            </div>

            <button type="submit" className={styles.submitButton}>
              <span className={styles.buttonIcon}>📤</span>
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className={styles.contactInfo}>
          <h2 className={styles.sectionTitle}>Contact Information</h2>
          
          <div className={styles.infoCard}>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📧</span>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Email</h3>
                <p className={styles.infoText}>contact@blogwebsite.com</p>
                <p className={styles.infoText}>support@blogwebsite.com</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>🌐</span>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Website</h3>
                <p className={styles.infoText}>www.blogwebsite.com</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>💬</span>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Social Media</h3>
                <div className={styles.socialLinks}>
                  <a href="#" className={styles.socialLink}>Twitter</a>
                  <a href="#" className={styles.socialLink}>LinkedIn</a>
                  <a href="#" className={styles.socialLink}>GitHub</a>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.responseTime}>
            <h3 className={styles.responseTitle}>📅 Response Time</h3>
            <ul className={styles.responseList}>
              <li>General inquiries: 24-48 hours</li>
              <li>Technical support: 12-24 hours</li>
              <li>Bug reports: 2-4 hours</li>
              <li>Partnership requests: 3-5 business days</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div className={styles.faqGrid}>
          <div className={styles.faqItem}>
            <h4 className={styles.faqQuestion}>How do I create an account?</h4>
            <p className={styles.faqAnswer}>
              You can sign up using your GitHub or Google account, or create an account with your email and password.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h4 className={styles.faqQuestion}>How do I publish a blog post?</h4>
            <p className={styles.faqAnswer}>
              After logging in, go to your dashboard and click "Create Post". Write your content, add tags and categories, then publish.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h4 className={styles.faqQuestion}>Can I edit my posts after publishing?</h4>
            <p className={styles.faqAnswer}>
              Yes! You can edit or delete your posts anytime from your dashboard. Changes will be reflected immediately.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h4 className={styles.faqQuestion}>How does the comment system work?</h4>
            <p className={styles.faqAnswer}>
              Our real-time comment system allows you to post comments and replies instantly. All comments appear in real-time without page refresh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
