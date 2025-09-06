"use client";

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.scss';

const Footer = () => {
    const currentYear = new Date().getFullYear();

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
                                <a href="#" className={styles.footerLink}>
                                    Contact Us
                                </a>
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
                        <form className={styles.newsletterForm}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={styles.newsletterInput}
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
