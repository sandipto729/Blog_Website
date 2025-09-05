'use client';

import React from 'react';
import Link from 'next/link';
import styles from './privacy.module.scss';

const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last updated: September 6, 2025</p>
        </div>

        <div className={styles.sections}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
            <div className={styles.sectionContent}>
              <h3 className={styles.subTitle}>Personal Information</h3>
              <p className={styles.paragraph}>
                When you create an account on BlogSpace, we collect information such as your name, 
                email address, and profile picture. This information is used to create and manage 
                your account, personalize your experience, and enable you to interact with our platform.
              </p>
              
              <h3 className={styles.subTitle}>Content Information</h3>
              <p className={styles.paragraph}>
                We collect and store the blog posts, comments, and other content you create on our platform. 
                This includes text, images, and any metadata associated with your content.
              </p>

              <h3 className={styles.subTitle}>Usage Information</h3>
              <p className={styles.paragraph}>
                We automatically collect information about how you use our service, including your 
                interactions with content, features used, and time spent on different sections of the platform.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
            <div className={styles.sectionContent}>
              <ul className={styles.list}>
                <li>Provide, maintain, and improve our services</li>
                <li>Personalize your experience and content recommendations</li>
                <li>Communicate with you about your account and our services</li>
                <li>Ensure security and prevent fraud</li>
                <li>Analyze usage patterns to improve our platform</li>
                <li>Send you notifications about activity on your content</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Information Sharing</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                We do not sell, trade, or rent your personal information to third parties. We may share 
                your information only in the following circumstances:
              </p>
              <ul className={styles.list}>
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>With service providers who assist us in operating our platform</li>
                <li>In connection with a merger, sale, or acquisition of our business</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Data Security</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. However, 
                no method of transmission over the internet is 100% secure.
              </p>
              <p className={styles.paragraph}>
                We use encryption, secure servers, and regular security audits to protect your data. 
                We also limit access to personal information to employees who need it to perform their jobs.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Your Rights</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                You have the following rights regarding your personal information:
              </p>
              <ul className={styles.list}>
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate personal information</li>
                <li><strong>Erasure:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                <li><strong>Restriction:</strong> Request limitation of processing of your data</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Cookies and Tracking</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                We use cookies and similar technologies to enhance your experience, analyze usage, 
                and provide personalized content. You can manage your cookie preferences through 
                your browser settings. For more information, please see our 
                <Link href="/cookies" className={styles.inlineLink}> Cookie Policy</Link>.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Third-Party Services</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Our platform may contain links to third-party websites or integrate with third-party 
                services. We are not responsible for the privacy practices of these external services. 
                We encourage you to review their privacy policies.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Children's Privacy</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Our service is not intended for children under 13 years of age. We do not knowingly 
                collect personal information from children under 13. If you become aware that a child 
                has provided us with personal information, please contact us.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Changes to This Policy</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                We may update this privacy policy from time to time. We will notify you of any 
                significant changes by posting the new policy on this page and updating the 
                "Last updated" date at the top of this document.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Contact Us</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                If you have any questions about this privacy policy or our privacy practices, 
                please contact us at:
              </p>
              <div className={styles.contactInfo}>
                <p><strong>Email:</strong> privacy@blogspace.com</p>
                <p><strong>Address:</strong> BlogSpace Privacy Team, 123 Web Street, Internet City, IC 12345</p>
              </div>
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

export default PrivacyPolicy;
