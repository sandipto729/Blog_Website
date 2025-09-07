"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
// import { useComments } from '../../hooks/useComments';
import styles from './Comments.module.scss';

const Comments = ({ postId }) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const { data: session } = useSession();
  // const { comments, loading, error, submitComment } = useComments(postId);
  const comments = []; // Placeholder until useComments is implemented
  const loading = false; // Placeholder until useComments is implemented
  const error = null; // Placeholder until useComments is implemented
  const submitComment = async (content, parentId = null) => {
    // Placeholder function until useComments is implemented
    return true;
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const success = await submitComment(newComment);
    if (success) {
      setNewComment('');
    }
  };

  const handleSubmitReply = async (e, parentId) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    const success = await submitComment(replyContent, parentId);
    if (success) {
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading && comments.length === 0) {
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
          {error}
        </div>
      )}

      {/* Comment Form */}
      {session ? (
        <form className={styles.commentForm} onSubmit={handleSubmitComment}>
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
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
          </div>
          <div className={styles.commentActions}>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={!newComment.trim()}
            >
              Post Comment
            </button>
          </div>
        </form>
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

              {/* Comment Actions */}
              <div className={styles.commentFooter}>
                <button 
                  className={styles.replyButton}
                  onClick={() => {
                    setReplyingTo(replyingTo === comment.id ? null : comment.id);
                    setReplyContent('');
                  }}
                >
                  💬 Reply
                </button>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && session && (
                <form 
                  className={styles.replyForm} 
                  onSubmit={(e) => handleSubmitReply(e, comment.id)}
                >
                  <div className={styles.replyInputWrapper}>
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
                      className={styles.replyInput}
                      placeholder={`Reply to ${comment.user?.name}...`}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className={styles.replyActions}>
                    <button 
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent('');
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className={styles.submitButton}
                      disabled={!replyContent.trim()}
                    >
                      Reply
                    </button>
                  </div>
                </form>
              )}

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
