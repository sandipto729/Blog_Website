'use client';

import React from 'react';
import Link from 'next/link';
import styles from './cookies.module.scss';

const CookiePolicy = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>
          <h1 className={styles.title}>Cookie Policy</h1>
          <p className={styles.lastUpdated}>Last updated: September 6, 2025</p>
        </div>

        <div className={styles.sections}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. What Are Cookies?</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Cookies are small text files that are stored on your device when you visit a website. 
                They help websites remember information about your visit, such as your preferred language 
                and other settings, which can make your next visit easier and the site more useful to you.
              </p>
              <p className={styles.paragraph}>
                BlogSpace uses cookies and similar technologies to enhance your browsing experience, 
                analyze site traffic, and personalize content and advertisements.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Types of Cookies We Use</h2>
            <div className={styles.sectionContent}>
              <h3 className={styles.subTitle}>Essential Cookies</h3>
              <p className={styles.paragraph}>
                These cookies are necessary for the website to function properly. They enable basic 
                functions like page navigation, access to secure areas, and authentication. The website 
                cannot function properly without these cookies.
              </p>
              <ul className={styles.list}>
                <li>Session management and user authentication</li>
                <li>Security and fraud prevention</li>
                <li>Basic site functionality</li>
                <li>Load balancing and performance optimization</li>
              </ul>

              <h3 className={styles.subTitle}>Analytics Cookies</h3>
              <p className={styles.paragraph}>
                These cookies help us understand how visitors interact with our website by collecting 
                and reporting information anonymously. This helps us improve our website's performance 
                and user experience.
              </p>
              <ul className={styles.list}>
                <li>Page views and user sessions</li>
                <li>Traffic sources and referrals</li>
                <li>Popular content and features</li>
                <li>User behavior patterns</li>
                <li>Site performance metrics</li>
              </ul>

              <h3 className={styles.subTitle}>Functional Cookies</h3>
              <p className={styles.paragraph}>
                These cookies enable enhanced functionality and personalization, such as remembering 
                your preferences, language settings, and other customizations.
              </p>
              <ul className={styles.list}>
                <li>Language preferences</li>
                <li>Theme and display settings</li>
                <li>Personalized content recommendations</li>
                <li>Recently viewed articles</li>
                <li>User interface preferences</li>
              </ul>

              <h3 className={styles.subTitle}>Performance Cookies</h3>
              <p className={styles.paragraph}>
                These cookies collect information about how you use our website, which pages you visit 
                most often, and any error messages you encounter. This information helps us optimize 
                our website's performance.
              </p>
              <ul className={styles.list}>
                <li>Page load times</li>
                <li>Error tracking</li>
                <li>Feature usage statistics</li>
                <li>Performance bottlenecks</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Third-Party Cookies</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                We may use third-party services that set their own cookies on your device. These 
                services include:
              </p>

              <h3 className={styles.subTitle}>Analytics Services</h3>
              <ul className={styles.list}>
                <li><strong>Google Analytics:</strong> Helps us understand user behavior and improve our service</li>
                <li><strong>Hotjar:</strong> Provides heatmaps and user session recordings</li>
              </ul>

              <h3 className={styles.subTitle}>Social Media Integration</h3>
              <ul className={styles.list}>
                <li><strong>Social sharing buttons:</strong> Enable sharing content on social platforms</li>
                <li><strong>Social login:</strong> Allow authentication through social media accounts</li>
              </ul>

              <h3 className={styles.subTitle}>Content Delivery</h3>
              <ul className={styles.list}>
                <li><strong>CDN services:</strong> Improve page loading speed and performance</li>
                <li><strong>Font services:</strong> Deliver custom fonts for better typography</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. How Long Do Cookies Last?</h2>
            <div className={styles.sectionContent}>
              <h3 className={styles.subTitle}>Session Cookies</h3>
              <p className={styles.paragraph}>
                These cookies are temporary and are deleted when you close your browser. They're used 
                for essential functions like maintaining your login session.
              </p>

              <h3 className={styles.subTitle}>Persistent Cookies</h3>
              <p className={styles.paragraph}>
                These cookies remain on your device for a set period or until you delete them. We use 
                different durations based on the cookie's purpose:
              </p>
              <ul className={styles.list}>
                <li><strong>Functional cookies:</strong> Up to 1 year</li>
                <li><strong>Analytics cookies:</strong> Up to 2 years</li>
                <li><strong>Preference cookies:</strong> Up to 6 months</li>
                <li><strong>Authentication cookies:</strong> Up to 30 days</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Managing Your Cookie Preferences</h2>
            <div className={styles.sectionContent}>
              <h3 className={styles.subTitle}>Browser Settings</h3>
              <p className={styles.paragraph}>
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className={styles.list}>
                <li>View what cookies are stored on your device</li>
                <li>Delete existing cookies</li>
                <li>Block cookies from specific websites</li>
                <li>Block all cookies (may affect website functionality)</li>
                <li>Set preferences for accepting cookies</li>
              </ul>

              <h3 className={styles.subTitle}>Browser-Specific Instructions</h3>
              <div className={styles.browserGrid}>
                <div className={styles.browserCard}>
                  <strong>Chrome:</strong>
                  <p>Settings → Privacy and Security → Cookies and other site data</p>
                </div>
                <div className={styles.browserCard}>
                  <strong>Firefox:</strong>
                  <p>Preferences → Privacy & Security → Cookies and Site Data</p>
                </div>
                <div className={styles.browserCard}>
                  <strong>Safari:</strong>
                  <p>Preferences → Privacy → Manage Website Data</p>
                </div>
                <div className={styles.browserCard}>
                  <strong>Edge:</strong>
                  <p>Settings → Cookies and site permissions → Cookies and site data</p>
                </div>
              </div>

              <h3 className={styles.subTitle}>Opt-Out Tools</h3>
              <p className={styles.paragraph}>
                You can also use these tools to manage tracking and analytics cookies:
              </p>
              <ul className={styles.list}>
                <li><a href="https://tools.google.com/dlpage/gaoptout" className={styles.externalLink}>Google Analytics Opt-out</a></li>
                <li><a href="http://optout.aboutads.info/" className={styles.externalLink}>Digital Advertising Alliance Opt-out</a></li>
                <li><a href="http://www.youronlinechoices.com/" className={styles.externalLink}>Your Online Choices</a></li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Impact of Disabling Cookies</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                While you can disable cookies, doing so may affect your experience on our website:
              </p>
              <ul className={styles.list}>
                <li>You may need to log in repeatedly</li>
                <li>Your preferences and settings may not be saved</li>
                <li>Some features may not work properly</li>
                <li>Content may not be personalized to your interests</li>
                <li>We cannot provide certain personalized services</li>
              </ul>
              <p className={styles.paragraph}>
                Essential cookies cannot be disabled as they are necessary for the website to function.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Updates to This Policy</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                We may update this Cookie Policy from time to time to reflect changes in our practices 
                or for other operational, legal, or regulatory reasons. We will notify you of any 
                significant changes by posting the updated policy on this page.
              </p>
              <p className={styles.paragraph}>
                We encourage you to review this policy periodically to stay informed about how we 
                use cookies.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Contact Us</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                If you have any questions about our use of cookies or this Cookie Policy, please 
                contact us at:
              </p>
              <div className={styles.contactInfo}>
                <p><strong>Email:</strong> cookies@blogspace.com</p>
                <p><strong>Address:</strong> BlogSpace Cookie Policy Team, 123 Web Street, Internet City, IC 12345</p>
              </div>
              <p className={styles.paragraph}>
                For more information about your privacy rights, please see our 
                <Link href="/privacy" className={styles.inlineLink}> Privacy Policy</Link>.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.bgOrb} style={{ top: '20%', left: '5%' }}></div>
        <div className={styles.bgOrb} style={{ top: '60%', right: '10%' }}></div>
        <div className={styles.bgOrb} style={{ bottom: '30%', left: '15%' }}></div>
      </div>
    </div>
  );
};

export default CookiePolicy;
