"use client";

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styles from './home.module.scss';

const HomePage = () => {
  const { data: session } = useSession();

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Welcome to <span className={styles.brandName}>BlogSpace</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Discover amazing stories, insights, and perspectives from writers around the world. 
              Share your thoughts and connect with a community of passionate storytellers.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/blog" className={styles.primaryButton}>
                Explore Stories
              </Link>
              {session ? (
                <Link href="/create-post" className={styles.secondaryButton}>
                  Write Your Story
                </Link>
              ) : (
                <Link href="/signup" className={styles.secondaryButton}>
                  Join Community
                </Link>
              )}
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroImagePlaceholder}>
              <div className={styles.floatingCard}>
                <div className={styles.cardIcon}>✍️</div>
                <h3>Write</h3>
                <p>Share your thoughts</p>
              </div>
              <div className={styles.floatingCard}>
                <div className={styles.cardIcon}>📖</div>
                <h3>Read</h3>
                <p>Discover new ideas</p>
              </div>
              <div className={styles.floatingCard}>
                <div className={styles.cardIcon}>💬</div>
                <h3>Connect</h3>
                <p>Join discussions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Choose BlogSpace?</h2>
            <p className={styles.sectionSubtitle}>
              Everything you need to share your stories and connect with readers
            </p>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🚀</div>
              <h3 className={styles.featureTitle}>Easy Publishing</h3>
              <p className={styles.featureDescription}>
                Create and publish beautiful blog posts with our intuitive editor. 
                No technical skills required.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🌍</div>
              <h3 className={styles.featureTitle}>Global Community</h3>
              <p className={styles.featureDescription}>
                Connect with writers and readers from around the world. 
                Share ideas and grow together.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3 className={styles.featureTitle}>Analytics & Insights</h3>
              <p className={styles.featureDescription}>
                Track your post performance with detailed analytics. 
                Understand your audience better.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎨</div>
              <h3 className={styles.featureTitle}>Beautiful Design</h3>
              <p className={styles.featureDescription}>
                Your content deserves a beautiful presentation. 
                Clean, modern design that readers love.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h3 className={styles.featureTitle}>Secure & Private</h3>
              <p className={styles.featureDescription}>
                Your data is safe with us. Advanced security measures 
                to protect your content and privacy.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3 className={styles.featureTitle}>Lightning Fast</h3>
              <p className={styles.featureDescription}>
                Optimized for speed and performance. 
                Your readers will love the fast loading times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsContent}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>10K+</div>
              <div className={styles.statLabel}>Active Writers</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>50K+</div>
              <div className={styles.statLabel}>Stories Published</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>1M+</div>
              <div className={styles.statLabel}>Monthly Readers</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>25+</div>
              <div className={styles.statLabel}>Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Share Your Story?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of writers who have already started their journey with BlogSpace
          </p>
          <div className={styles.ctaButtons}>
            {session ? (
              <>
                <Link href="/create-post" className={styles.ctaPrimary}>
                  Start Writing
                </Link>
                <Link href="/dashboard" className={styles.ctaSecondary}>
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/signup" className={styles.ctaPrimary}>
                  Get Started Free
                </Link>
                <Link href="/login" className={styles.ctaSecondary}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.bgOrb} style={{ top: '10%', left: '5%' }}></div>
        <div className={styles.bgOrb} style={{ top: '60%', right: '10%' }}></div>
        <div className={styles.bgOrb} style={{ bottom: '20%', left: '15%' }}></div>
      </div>
    </div>
  );
};

export default HomePage;
