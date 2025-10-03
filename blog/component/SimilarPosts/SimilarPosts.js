import React from 'react';
import { useQuery } from '@apollo/client/react';
import Link from 'next/link';
import { GET_SIMILAR_POSTS } from './queries';
import styles from './SimilarPosts.module.scss';

const SimilarPosts = ({ postId, limit = 5 }) => {
    const { loading, error, data } = useQuery(GET_SIMILAR_POSTS, {
        variables: { postId, limit },
        skip: !postId,
        errorPolicy: 'all'
    });

    if (!postId) return null;
    
    if (loading) {
        return (
            <div className={styles.container}>
                <h3 className={styles.title}>Similar Posts</h3>
                <div className={styles.loading}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Finding similar posts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        console.error('Error fetching similar posts:', error);
        return (
            <div className={styles.container}>
                <h3 className={styles.title}>Similar Posts</h3>
                <div className={styles.error}>
                    <p>Unable to load similar posts at the moment.</p>
                </div>
            </div>
        );
    }

    const similarPosts = data?.similarPosts || [];

    if (similarPosts.length === 0) {
        return (
            <div className={styles.container}>
                <h3 className={styles.title}>Similar Posts</h3>
                <div className={styles.empty}>
                    <p>No similar posts found yet. Check back later!</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                <span className={styles.icon}>🔍</span>
                Similar Posts
                <span className={styles.aiLabel}>AI-Powered</span>
            </h3>
            
            <div className={styles.postsList}>
                {similarPosts.map((post, index) => (
                    <Link 
                        key={post.postId} 
                        href={`/blog/${post.postId}`}
                        className={styles.postCard}
                    >
                        <div className={styles.postContent}>
                            <div className={styles.postHeader}>
                                <h4 className={styles.postTitle}>{post.title}</h4>
                                <div className={styles.similarityScore}>
                                    <span className={styles.scoreBar}>
                                        <span 
                                            className={styles.scoreFill}
                                            style={{ width: `${(post.similarity * 100)}%` }}
                                        ></span>
                                    </span>
                                    <span className={styles.scoreText}>
                                        {(post.similarity * 100).toFixed(1)}% match
                                    </span>
                                </div>
                            </div>
                            
                            {post.excerpt && (
                                <p className={styles.postExcerpt}>{post.excerpt}</p>
                            )}
                            
                            <div className={styles.postMeta}>
                                {post.category && (
                                    <span className={styles.category}>
                                        📂 {post.category}
                                    </span>
                                )}
                                
                                <div className={styles.engagement}>
                                    <span className={styles.stat}>
                                        ❤️ {post.likes}
                                    </span>
                                    <span className={styles.stat}>
                                        💬 {post.comments}
                                    </span>
                                </div>
                            </div>

                            {post.tags && post.tags.length > 0 && (
                                <div className={styles.tags}>
                                    {post.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className={styles.tag}>
                                            #{tag}
                                        </span>
                                    ))}
                                    {post.tags.length > 3 && (
                                        <span className={styles.moreTag}>
                                            +{post.tags.length - 3} more
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className={styles.postRank}>
                            #{index + 1}
                        </div>
                    </Link>
                ))}
            </div>
            
            <div className={styles.aiInfo}>
                <p>
                    <span className={styles.aiIcon}>🧠</span>
                    Recommendations powered by GraphSAGE neural embeddings
                </p>
            </div>
        </div>
    );
};

export default SimilarPosts;