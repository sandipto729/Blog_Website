"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@apollo/client/react';
import FETCH_COMMENTS from './Query';
import styles from './Comments.module.scss';
import { useState, useEffect } from 'react';
import { socket } from "@/socket";

const Comments = ({ postId }) => {
  const { data: session } = useSession();
  const { data, loading, error, refetch } = useQuery(FETCH_COMMENTS, {
    variables: { postId },
    skip: !postId
  });

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [realTimeComments, setRealTimeComments] = useState([]);


  const comments = data?.fetchComments || [];
  
  // Combine database comments with real-time comments
  const allComments = [...comments, ...realTimeComments.filter(rtComment => 
    !comments.some(dbComment => dbComment.id === rtComment.id)
  )];


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



  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    // Socket event listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Listen for new comments from server
    socket.on("comment", (commentData) => {
      // Only process if this comment is for the current post
      if (commentData.postID === postId) {
        console.log("New comment received for this post:", commentData);
        console.log("User data in commentData:", commentData.user);
        console.log("All commentData keys:", Object.keys(commentData));
        
        const newComment = {
          id: commentData.commentID || Date.now().toString(),
          content: commentData.content,
          createdAt: commentData.createdAt || new Date().toISOString(),
          user: commentData.user || {
            id: commentData.userID,
            name: 'Anonymous',
            profilePicture: ''
          }
        };

        // Check if this is a reply to another comment
        if (commentData.parentID) {
          // This is a reply - add it to the parent comment's replies
          setRealTimeComments(prev => 
            prev.map(comment => 
              comment.id === commentData.parentID 
                ? { ...comment, replies: [...(comment.replies || []), newComment] }
                : comment
            )
          );
          
          // Also check database comments for the parent
          const allComments = [...comments, ...realTimeComments];
          const parentExists = allComments.some(comment => comment.id === commentData.parentID);
          
          if (parentExists) {
            // Force a refetch to get the updated reply structure from database
            setTimeout(() => {
              refetch();
            }, 500);
          }
        } else {
          // This is a main comment
          const mainComment = { ...newComment, replies: [] };
          setRealTimeComments(prev => [...prev, mainComment]);
        }
        
        // Also refetch from database for consistency
        // setTimeout(() => {
        //   refetch();
        //   // Clear real-time comments after database refresh
        //   setRealTimeComments(prev => prev.filter(c => c.id !== newComment.id));
        // }, 1000);
      }
    });

    // Listen for comment save errors
    socket.on("commentSaved", (response) => {
      if (!response.success) {
        alert("Failed to save comment: " + response.message);
      }
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("comment");
      socket.off("commentSaved");
    };
  }, [postId, refetch]);

  const handleCommentSubmit = (parentID = null) => {
    const textContent = parentID ? replyText : commentText;
    const setTextContent = parentID ? setReplyText : setCommentText;

    // Check if comment/reply text is empty
    if (!textContent.trim()) {
      alert(`Please enter a ${parentID ? 'reply' : 'comment'} before submitting.`);
      return;
    }

    // Check if user is logged in
    if (!session?.user?.id) {
      alert('Please login to post a comment.');
      return;
    }

    // Prepare comment/reply data
    const data = {
      postID: postId,
      content: textContent.trim(),
      parentID: parentID,
      userID: session.user.id
    };

    console.log(`${parentID ? 'Reply' : 'Comment'} data to be submitted:`, data);

    socket.emit("comment", data);

    // Clear the text area after submission
    setTextContent("");

    // If it was a reply, close the reply form
    if (parentID) {
      setReplyingTo(null);
    }
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
        Comments ({allComments.length})
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
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
            />
            <div className={styles.commentActions}>
              <button
                className={styles.submitButton}
                onClick={() => handleCommentSubmit()}
                disabled={!commentText.trim()}
              >
                Post Comment
              </button>
            </div>
          </div>
          {/* <div className={styles.socketStatus}>
            <p>Socket Status: {isConnected ? "Connected" : "Disconnected"}</p>
            <p>Transport: {transport}</p>
          </div> */}
        </div>
      ) : (
        <div className={styles.loginPrompt}>
          <p>Please <a href="/login">login</a> to post comments.</p>
        </div>
      )}

      {/* Comments List */}
      <div className={styles.commentsList}>
        {allComments.length === 0 ? (
          <div className={styles.noComments}>
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          allComments.map((comment) => (
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
                    setReplyText('');
                  }}
                >
                  💬 Reply
                </button>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && session && (
                <div className={styles.replyForm}>
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
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className={styles.replyActions}>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.submitButton}
                      onClick={() => handleCommentSubmit(comment.id)}
                      disabled={!replyText.trim()}
                    >
                      Reply
                    </button>
                  </div>
                </div>
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
