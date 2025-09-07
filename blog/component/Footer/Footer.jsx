"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.scss';
import {handleNewsLetter} from './NewsLetter'
import toast from 'react-hot-toast';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState('');

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        
        if (!email.trim()) {
            toast.error('📧 Please enter your email address', {
                style: {
                    background: '#2d3748',
                    color: '#f7fafc',
                    border: '1px solid #f56565',
                },
            });
            return;
        }

        const formData = new FormData();
        formData.append('email', email);

        const submitPromise = handleNewsLetter(formData);
        
        toast.promise(
            submitPromise,
            {
                loading: '📮 Subscribing to newsletter...',
                success: (result) => {
                    if (result.success) {
                        setEmail(''); // Clear the input on success
                        return '✅ Successfully subscribed! Welcome email sent to your inbox 📧';
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (err) => {
                    if (err.message.includes('duplicate') || err.message.includes('E11000')) {
                        return '📬 You are already subscribed to our newsletter!';
                    }
                    return `❌ ${err.message || 'Failed to subscribe. Please try again.'}`;
                },
            },
            {
                style: {
                    minWidth: '300px',
                    background: '#2d3748',
                    color: '#f7fafc',
                    border: '1px solid #4a5568',
                },
                success: {
                    duration: 4000,
                    iconTheme: {
                        primary: '#48bb78',
                        secondary: '#f7fafc',
                    },
                },
                error: {
                    duration: 3000,
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
        <footer className={styles.footer}>
            <div className={styles.container} suppressHydrationWarning={true}>
                {/* Main Footer Content */}
                <div className={styles.content} suppressHydrationWarning={true}>
                    {/* Brand Section */}
                    <div className={styles.brandSection} suppressHydrationWarning={true}>
                        <div className={styles.logo} suppressHydrationWarning={true}>
                            <div className={styles.logoIcon} suppressHydrationWarning={true}>📝</div>
                            <span className={styles.logoText}>BlogSpace</span>
                        </div>
                        <p className={styles.description}>
                            A modern platform for sharing ideas, insights, and stories. 
                            Join our community of writers and readers.
                        </p>
                        <div className={styles.socialLinks} suppressHydrationWarning={true}>
                            <a href="#" className={styles.socialLink} aria-label="Twitter">
                                🐦
                            </a>
                            <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                                💼
                            </a>
                            <a href="#" className={styles.socialLink} aria-label="GitHub">
                                🐙
                            </a>
                            <a href="#" className={styles.socialLink} aria-label="Discord">
                                🎮
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.linksSection} suppressHydrationWarning={true}>
                        <h3 className={styles.sectionTitle}>Quick Links</h3>
                        <ul className={styles.linksList}>
                            <li>
                                <Link href="/" className={styles.footerLink}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className={styles.footerLink}>
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/create-post" className={styles.footerLink}>
                                    Write a Post
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className={styles.footerLink}>
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className={styles.linksSection} suppressHydrationWarning={true}>
                        <h3 className={styles.sectionTitle}>Categories</h3>
                        <ul className={styles.linksList}>
                            <li>
                                <Link href="/blog?category=technology" className={styles.footerLink}>
                                    Technology
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog?category=lifestyle" className={styles.footerLink}>
                                    Lifestyle
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog?category=travel" className={styles.footerLink}>
                                    Travel
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog?category=health" className={styles.footerLink}>
                                    Health
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className={styles.linksSection} suppressHydrationWarning={true}>
                        <h3 className={styles.sectionTitle}>Support</h3>
                        <ul className={styles.linksList}>
                            <li>
                                <a href="#" className={styles.footerLink}>
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className={styles.footerLink}>
                                    Community
                                </a>
                            </li>
                            <li>
                                <Link href="/contact" className={styles.footerLink}>
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <a href="#" className={styles.footerLink}>
                                    Feedback
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className={styles.newsletter} suppressHydrationWarning={true}>
                    <div className={styles.newsletterContent} suppressHydrationWarning={true}>
                        <h3 className={styles.newsletterTitle}>Stay Updated</h3>
                        <p className={styles.newsletterDescription}>
                            Get the latest posts and updates delivered to your inbox.
                        </p>
                        <form className={styles.newsletterForm} onSubmit={handleNewsletterSubmit}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={styles.newsletterInput}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className={styles.newsletterButton}>
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={styles.bottomBar} suppressHydrationWarning={true}>
                    <div className={styles.bottomContent} suppressHydrationWarning={true}>
                        <p className={styles.copyright}>
                            © {currentYear} BlogSpace. All rights reserved.
                        </p>
                        <div className={styles.bottomLinks} suppressHydrationWarning={true}>
                            <Link href="/privacy" className={styles.bottomLink}>
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className={styles.bottomLink}>
                                Terms of Service
                            </Link>
                            <Link href="/cookies" className={styles.bottomLink}>
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Elements */}
            <div className={styles.backgroundElements} suppressHydrationWarning={true}>
                <div className={styles.glowOrb} style={{ top: '20%', left: '10%' }} suppressHydrationWarning={true}></div>
                <div className={styles.glowOrb} style={{ top: '60%', right: '15%' }} suppressHydrationWarning={true}></div>
                <div className={styles.glowOrb} style={{ bottom: '30%', left: '70%' }} suppressHydrationWarning={true}></div>
            </div>
        </footer>
    );
};

export default Footer;
