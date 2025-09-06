"use client";

import React, { useState, use } from 'react';
import { useQuery } from '@apollo/client/react';
import GET_POST_BY_ID from './Query';
import styles from './blog-detail.module.scss';
import { useRouter } from 'next/navigation';

const BlogDetailPage = ({ params }) => {
    const router = useRouter();
    const [liked, setLiked] = useState(false);
    const [comment, setComment] = useState('');
    
    // Unwrap params using React.use() for Next.js 15
    const { id } = use(params);
    
    const { loading, error, data } = useQuery(GET_POST_BY_ID, {
        variables: { id }
    });

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p className={styles.loadingText}>Loading blog post...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorIcon}>⚠️</div>
                <h2 className={styles.errorTitle}>Post Not Found</h2>
                <p className={styles.errorMessage}>
                    {error.message || 'The blog post you\'re looking for doesn\'t exist.'}
                </p>
                <button 
                    className={styles.backButton}
                    onClick={() => router.push('/blog')}
                >
                    ← Back to Blog
                </button>
            </div>
        );
    }

    const post = data?.post;

    if (!post) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorIcon}>📝</div>
                <h2 className={styles.errorTitle}>Post Not Found</h2>
                <p className={styles.errorMessage}>
                    The blog post you're looking for doesn't exist.
                </p>
                <button 
                    className={styles.backButton}
                    onClick={() => router.push('/blog')}
                >
                    ← Back to Blog
                </button>
            </div>
        );
    }

    const handleLike = () => {
        setLiked(!liked);
        // TODO: Implement actual like functionality with mutation
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            // TODO: Implement comment submission with mutation
            console.log('Comment:', comment);
            setComment('');
        }
    };

    return (
        <div className={styles.container}>
            {/* Back Navigation */}
            <div className={styles.navigation}>
                <button 
                    className={styles.backButton}
                    onClick={() => router.push('/blog')}
                >
                    ← Back to Blog
                </button>
            </div>

            {/* Hero Section */}
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    {post.featured && (
                        <div className={styles.featuredBadge}>
                            ⭐ Featured Post
                        </div>
                    )}
                    
                    <div className={styles.category}>{post.category}</div>
                    
                    <h1 className={styles.title}>{post.title}</h1>
                    
                    {post.excerpt && (
                        <p className={styles.excerpt}>{post.excerpt}</p>
                    )}

                    {/* Author & Meta Info */}
                    <div className={styles.metaSection}>
                        <div className={styles.authorInfo}>
                            {post.author?.profilePicture ? (
                                <img 
                                    src={post.author.profilePicture} 
                                    alt={post.author.name} 
                                    className={styles.authorAvatar}
                                />
                            ) : (
                                <div className={styles.authorAvatarPlaceholder}>
                                    {post.author?.name?.charAt(0) || '?'}
                                </div>
                            )}
                            <div className={styles.authorDetails}>
                                <h3 className={styles.authorName}>
                                    {post.author?.name || 'Anonymous'}
                                </h3>
                                <div className={styles.postMeta}>
                                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</span>
                                    {post.readTime && (
                                        <>
                                            <span>•</span>
                                            <span>{post.readTime} min read</span>
                                        </>
                                    )}
                                    <span>•</span>
                                    <span>{post.views || 0} views</span>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className={styles.tags}>
                                {post.tags.map((tag, index) => (
                                    <span key={index} className={styles.tag}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className={styles.contentWrapper}>
                <article className={styles.content}>
                    <div 
                        className={styles.blogContent}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>

                {/* Engagement Section */}
                <div className={styles.engagement}>
                    {/* Like Button */}
                    <div className={styles.likeSection}>
                        <button 
                            className={`${styles.likeButton} ${liked ? styles.liked : ''}`}
                            onClick={handleLike}
                        >
                            <span className={styles.likeIcon}>
                                {liked ? '❤️' : '🤍'}
                            </span>
                            <span>{(post.likes?.length || 0) + (liked ? 1 : 0)} likes</span>
                        </button>
                    </div>

                    {/* Comments Section */}
                    <div className={styles.commentsSection}>
                        <h3 className={styles.commentsTitle}>
                            Comments ({post.comments?.length || 0})
                        </h3>

                        {/* Comment Form */}
                        <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
                            <textarea
                                className={styles.commentInput}
                                placeholder="Share your thoughts..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                            />
                            <button 
                                type="submit" 
                                className={styles.commentSubmit}
                                disabled={!comment.trim()}
                            >
                                Post Comment
                            </button>
                        </form>

                        {/* Existing Comments */}
                        <div className={styles.commentsList}>
                            {post.comments && post.comments.length > 0 ? (
                                post.comments.map((comment, index) => (
                                    <div key={index} className={styles.commentItem}>
                                        <div className={styles.commentAuthor}>
                                            {comment.author?.profilePicture ? (
                                                <img 
                                                    src={comment.author.profilePicture} 
                                                    alt={comment.author.name} 
                                                    className={styles.commentAvatar}
                                                />
                                            ) : (
                                                <div className={styles.commentAvatarPlaceholder}>
                                                    {comment.author?.name?.charAt(0) || '?'}
                                                </div>
                                            )}
                                            <div>
                                                <h4 className={styles.commentAuthorName}>
                                                    {comment.author?.name || 'Anonymous'}
                                                </h4>
                                                <span className={styles.commentDate}>
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <p className={styles.commentContent}>
                                            {comment.content}
                                        </p>
                                        <div className={styles.commentActions}>
                                            <button className={styles.commentLike}>
                                                🤍 {comment.likes?.length || 0}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.noComments}>
                                    <p>No comments yet. Be the first to share your thoughts!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Data (Hidden, for debugging) */}
            {(post.seoTitle || post.seoDescription) && (
                <div className={styles.seoInfo}>
                    <details>
                        <summary>SEO Information</summary>
                        {post.seoTitle && <p><strong>SEO Title:</strong> {post.seoTitle}</p>}
                        {post.seoDescription && <p><strong>SEO Description:</strong> {post.seoDescription}</p>}
                    </details>
                </div>
            )}
        </div>
    );
};

export default BlogDetailPage;
