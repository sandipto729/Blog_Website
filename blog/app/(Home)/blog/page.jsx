
"use client";

import React from 'react';
import { useQuery } from '@apollo/client/react';
import Fetch_POSTS from './Query';
import { useRouter } from 'next/navigation';
import styles from './blog.module.scss';

const BlogList = () => {
	const router = useRouter();
	const { loading, error, data } = useQuery(Fetch_POSTS);

	if (loading) {
		return (
			<div className={styles.loadingContainer}>
				<div className={styles.loadingSpinner}></div>
				<p className={styles.loadingText}>Loading blog posts...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.errorContainer}>
				<div className={styles.errorIcon}>⚠️</div>
				<h2 className={styles.errorTitle}>Oops! Something went wrong</h2>
				<p className={styles.errorMessage}>
					{error.message || 'Failed to load blog posts. Please try again later.'}
				</p>
			</div>
		);
	}

	if (!data?.posts || data.posts.length === 0) {
		return (
			<div className={styles.emptyState}>
				<div className={styles.emptyIcon}>📝</div>
				<h2 className={styles.emptyTitle}>No blog posts yet</h2>
				<p className={styles.emptyMessage}>
					Check back later for fresh content and insights!
				</p>
			</div>
		);
	}

	return (
		<div className={styles.blogGrid}>
			{data.posts.map(post => (
				<div
					key={post.id}
					className={styles.blogCard}
					onClick={() => router.push(`/blog/${post.id}`)}
					tabIndex={0}
					role="button"
					onKeyPress={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							router.push(`/blog/${post.id}`);
						}
					}}
				>
					<div className={styles.category}>{post.category || 'General'}</div>
					
					<h2 className={styles.cardTitle}>{post.title}</h2>
					
					<div className={styles.cardMeta}>
						<div className={styles.metaItem}>
							{post.author?.profilePicture ? (
								<img 
									src={post.author.profilePicture} 
									alt={post.author.name || 'Author'} 
									className={styles.authorAvatar}
								/>
							) : (
								<span className={styles.metaIcon}>👤</span>
							)}
							<span>{post.author?.name || 'Anonymous'}</span>
						</div>
						<div className={styles.metaItem}>
							<span className={styles.metaIcon}>👁️</span>
							<span>{post.views || 0} views</span>
						</div>
						{post.readTime && (
							<div className={styles.metaItem}>
								<span className={styles.metaIcon}>⏱️</span>
								<span>{post.readTime} min read</span>
							</div>
						)}
					</div>

					<div className={`${styles.publishedStatus} ${post.published ? styles.published : styles.draft}`}>
						<span className={styles.statusIcon}>
							{post.published ? '✅' : '📝'}
						</span>
						<span>{post.published ? 'Published' : 'Draft'}</span>
					</div>

					{post.tags && post.tags.length > 0 && (
						<div className={styles.tags}>
							{post.tags.slice(0, 3).map((tag, index) => (
								<span key={index} className={styles.tag}>
									{tag}
								</span>
							))}
							{post.tags.length > 3 && (
								<span className={styles.tag}>
									+{post.tags.length - 3} more
								</span>
							)}
						</div>
					)}

					<div className={styles.cardFooter}>
						<div className={styles.date}>
							{new Date(post.createdAt).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'short',
								day: 'numeric'
							})}
						</div>
						<div className={styles.readMore}>
							<span>Read more</span>
							<span className={styles.arrow}>→</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default function Page() {
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>Our Blog</h1>
				<p className={styles.subtitle}>
					Discover insights, tutorials, and stories from our community
				</p>
			</div>
			<BlogList />
		</div>
	);
}
