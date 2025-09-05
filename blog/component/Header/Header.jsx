"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Header.module.scss';

const Header = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <div className={styles.logoIcon}>📝</div>
                    <span className={styles.logoText}>BlogSpace</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className={styles.nav}>
                    <Link href="/" className={styles.navLink}>
                        Home
                    </Link>
                    <Link href="/blog" className={styles.navLink}>
                        Blog
                    </Link>
                    {session && (
                        <>
                            <Link href="/create-post" className={styles.navLink}>
                                Write
                            </Link>
                            <Link href="/dashboard" className={styles.navLink}>
                                Dashboard
                            </Link>
                        </>
                    )}
                </nav>

                {/* Auth Section */}
                <div className={styles.authSection}>
                    {status === 'loading' ? (
                        <div className={styles.loadingSpinner}></div>
                    ) : session ? (
                        <div className={styles.userMenu}>
                            <div className={styles.userInfo}>
                                {(session.user?.profilePicture || session.user?.image) ? (
                                    <img 
                                        src={session.user?.profilePicture || session.user?.image} 
                                        alt={session.user.name} 
                                        className={styles.userAvatar}
                                    />
                                ) : (
                                    <div className={styles.userAvatarPlaceholder}>
                                        {session.user?.name?.charAt(0) || 'U'}
                                    </div>
                                )}
                                <span className={styles.userName}>
                                    {session.user?.name || 'User'}
                                </span>
                            </div>
                            <button 
                                className={styles.signOutButton}
                                onClick={handleSignOut}
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className={styles.authButtons}>
                            <Link href="/login" className={styles.loginButton}>
                                Sign In
                            </Link>
                            <Link href="/signup" className={styles.signupButton}>
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className={styles.mobileMenuButton}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
                <nav className={styles.mobileNav}>
                    <Link 
                        href="/" 
                        className={styles.mobileNavLink}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link 
                        href="/blog" 
                        className={styles.mobileNavLink}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Blog
                    </Link>
                    {session && (
                        <>
                            <Link 
                                href="/create-post" 
                                className={styles.mobileNavLink}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Write
                            </Link>
                            <Link 
                                href="/dashboard" 
                                className={styles.mobileNavLink}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                        </>
                    )}
                </nav>

                {/* Mobile Auth */}
                <div className={styles.mobileAuth}>
                    {session ? (
                        <div className={styles.mobileUserInfo}>
                            <div className={styles.mobileUserDetails}>
                                {session.user?.profilePicture ? (
                                    <img 
                                        src={session.user?.profilePicture || session.user?.image} 
                                        alt={session.user.name} 
                                        className={styles.mobileUserAvatar}
                                    />
                                ) : (
                                    <div className={styles.mobileUserAvatarPlaceholder}>
                                        {session.user?.name?.charAt(0) || 'U'}
                                    </div>
                                )}
                                <span className={styles.mobileUserName}>
                                    {session.user?.name || 'User'}
                                </span>
                            </div>
                            <button 
                                className={styles.mobileSignOutButton}
                                onClick={() => {
                                    handleSignOut();
                                    setIsMenuOpen(false);
                                }}
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className={styles.mobileAuthButtons}>
                            <Link 
                                href="/login" 
                                className={styles.mobileLoginButton}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link 
                                href="/signup" 
                                className={styles.mobileSignupButton}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
