'use client';

import React from 'react';
import Link from 'next/link';
import styles from './terms.module.scss';

const TermsOfService = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.lastUpdated}>Last updated: September 6, 2025</p>
        </div>

        <div className={styles.sections}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                By accessing and using BlogSpace ("the Service"), you accept and agree to be bound by 
                the terms and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Description of Service</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                BlogSpace is a web-based platform that allows users to create, publish, and share blog 
                posts and articles. The service includes features for writing, editing, commenting, and 
                social interaction around content.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. User Registration and Accounts</h2>
            <div className={styles.sectionContent}>
              <h3 className={styles.subTitle}>Account Creation</h3>
              <p className={styles.paragraph}>
                To use certain features of the service, you must register for an account. You agree to:
              </p>
              <ul className={styles.list}>
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Keep your password secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
              
              <h3 className={styles.subTitle}>Account Termination</h3>
              <p className={styles.paragraph}>
                You may terminate your account at any time. We reserve the right to suspend or 
                terminate accounts that violate these terms or engage in harmful activities.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Content and Conduct</h2>
            <div className={styles.sectionContent}>
              <h3 className={styles.subTitle}>Your Content</h3>
              <p className={styles.paragraph}>
                You retain ownership of content you create on BlogSpace. By posting content, you grant 
                us a worldwide, non-exclusive, royalty-free license to use, display, and distribute 
                your content on the platform.
              </p>
              
              <h3 className={styles.subTitle}>Prohibited Content</h3>
              <p className={styles.paragraph}>
                You agree not to post content that is:
              </p>
              <ul className={styles.list}>
                <li>Illegal, harmful, threatening, abusive, or discriminatory</li>
                <li>Defamatory, libelous, or invasive of privacy</li>
                <li>Contains hate speech, harassment, or bullying</li>
                <li>Infringes on intellectual property rights</li>
                <li>Contains malware, viruses, or harmful code</li>
                <li>Sexually explicit or inappropriate</li>
                <li>Spam, promotional, or commercial solicitation</li>
                <li>False or misleading information</li>
              </ul>

              <h3 className={styles.subTitle}>Community Guidelines</h3>
              <p className={styles.paragraph}>
                We encourage respectful discussion and constructive feedback. Users should:
              </p>
              <ul className={styles.list}>
                <li>Be respectful and considerate in interactions</li>
                <li>Provide constructive criticism and feedback</li>
                <li>Credit sources and respect intellectual property</li>
                <li>Report violations of these terms</li>
                <li>Contribute positively to the community</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Intellectual Property</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                The BlogSpace platform, including its design, features, and functionality, is owned by 
                us and protected by copyright, trademark, and other laws. You may not copy, modify, 
                distribute, or create derivative works without permission.
              </p>
              <p className={styles.paragraph}>
                Users retain rights to their original content but must respect the intellectual property 
                rights of others. We will respond to valid DMCA takedown requests.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Privacy and Data Protection</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Your privacy is important to us. Our collection and use of personal information is 
                governed by our <Link href="/privacy" className={styles.inlineLink}>Privacy Policy</Link>, 
                which is incorporated into these terms by reference.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Service Availability</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                We strive to maintain high availability but do not guarantee uninterrupted access to 
                the service. We may temporarily suspend access for maintenance, updates, or other 
                operational reasons.
              </p>
              <p className={styles.paragraph}>
                We reserve the right to modify, suspend, or discontinue any aspect of the service 
                with or without notice.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Disclaimers and Limitation of Liability</h2>
            <div className={styles.sectionContent}>
              <h3 className={styles.subTitle}>Disclaimers</h3>
              <p className={styles.paragraph}>
                The service is provided "as is" without warranties of any kind. We disclaim all 
                warranties, express or implied, including merchantability, fitness for a particular 
                purpose, and non-infringement.
              </p>
              
              <h3 className={styles.subTitle}>Limitation of Liability</h3>
              <p className={styles.paragraph}>
                To the maximum extent permitted by law, we shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including loss of profits, 
                data, or business opportunities.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Indemnification</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                You agree to indemnify and hold harmless BlogSpace and its affiliates from any claims, 
                damages, losses, or expenses arising from your use of the service, your content, or 
                your violation of these terms.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Governing Law</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                These terms shall be governed by and construed in accordance with the laws of the 
                jurisdiction where BlogSpace is headquartered, without regard to conflict of law principles.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Changes to Terms</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                We reserve the right to modify these terms at any time. We will notify users of 
                significant changes via email or prominent notice on the platform. Continued use 
                of the service after changes constitutes acceptance of the new terms.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>12. Contact Information</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                If you have questions about these terms, please contact us at:
              </p>
              <div className={styles.contactInfo}>
                <p><strong>Email:</strong> legal@blogspace.com</p>
                <p><strong>Address:</strong> BlogSpace Legal Team, 123 Web Street, Internet City, IC 12345</p>
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

export default TermsOfService;
