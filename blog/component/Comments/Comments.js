"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@apollo/client/react';
import FETCH_COMMENTS from './Query';
import styles from './Comments.module.scss';

const Comments = ({ postId }) => {
  const { data: session } = useSession();
  const { data, loading, error } = useQuery(FETCH_COMMENTS, {
    variables: { postId },
    skip: !postId
  });

  const comments = data?.fetchComments || [];

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={styles.commentsSection}>
        <h3 className={styles.commentsTitle}>Comments</h3>
        <div className={styles.loading}>Loading comments...</div>
      </div>
    );
  }

  return (
    <div className={styles.commentsSection}>
      <h3 className={styles.commentsTitle}>
        Comments ({comments.length})
      </h3>

      {error && (
        <div className={styles.error}>
          Error loading comments: {error.message}
        </div>
      )}

      {/* Comment Form - Placeholder for future implementation */}
      {session ? (
        <div className={styles.commentForm}>
          <div className={styles.commentInputWrapper}>
            <img 
              src={session.user?.image || session.user?.profilePicture || ''}
              alt={session.user?.name || 'User'}
              className={styles.userAvatar}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className={styles.userAvatarPlaceholder}>
              {session.user?.name?.charAt(0) || 'U'}
            </div>
            <textarea
              className={styles.commentInput}
              placeholder="Share your thoughts... (Coming soon)"
              disabled
              rows={3}
            />
          </div>
        </div>
      ) : (
        <div className={styles.loginPrompt}>
          <p>Please <a href="/login">login</a> to post comments.</p>
        </div>
      )}

      {/* Comments List */}
      <div className={styles.commentsList}>
        {comments.length === 0 ? (
          <div className={styles.noComments}>
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={styles.commentItem}>
              {/* Comment Header */}
              <div className={styles.commentHeader}>
                <div className={styles.commentAuthor}>
                  {comment.user?.profilePicture ? (
                    <img 
                      src={comment.user.profilePicture} 
                      alt={comment.user.name} 
                      className={styles.authorAvatar}
                    />
                  ) : (
                    <div className={styles.authorAvatarPlaceholder}>
                      {comment.user?.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <div className={styles.authorInfo}>
                    <span className={styles.authorName}>
                      {comment.user?.name || 'Anonymous'}
                    </span>
                    <span className={styles.commentDate}>
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment Content */}
              <div className={styles.commentContent}>
                <p>{comment.content}</p>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className={styles.replies}>
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className={styles.replyItem}>
                      <div className={styles.replyAuthor}>
                        {reply.user?.profilePicture ? (
                          <img 
                            src={reply.user.profilePicture} 
                            alt={reply.user.name} 
                            className={styles.authorAvatar}
                          />
                        ) : (
                          <div className={styles.authorAvatarPlaceholder}>
                            {reply.user?.name?.charAt(0) || '?'}
                          </div>
                        )}
                        <span className={styles.authorName}>
                          {reply.user?.name || 'Anonymous'}
                        </span>
                        <span className={styles.commentDate}>
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                      <div className={styles.replyContent}>
                        <p>{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
