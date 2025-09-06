'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useQuery, useMutation } from '@apollo/client/react'
import GET_POSTS_BY_AUTHOR from './Query'
import DELETE_POST from './deletemutation'
import toast from 'react-hot-toast'
import styles from './userPosts.module.scss'

const UserPostsPage = () => {
  const { userId } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [posts, setPosts] = useState([])

  // Query to fetch user posts
  const { loading, error, data, refetch } = useQuery(GET_POSTS_BY_AUTHOR, {
    variables: { authorId: userId },
    onCompleted: (data) => {
      setPosts(data.postsByAuthor || [])
    },
    onError: (error) => {
      toast.error('Failed to load posts')
    }
  })

  // Apollo mutation for delete
  const [deletePostMutation, { loading: deleteLoading }] = useMutation(DELETE_POST)

  useEffect(() => {
    if (data?.postsByAuthor) {
      setPosts(data.postsByAuthor)
    }
  }, [data])

  const isOwner = session?.user?.id === userId

  const handleEditPost = (post) => {
    // Redirect to create-post page with post data for editing
    const editUrl = `/create-post?edit=true&postId=${post.id}&title=${encodeURIComponent(post.title)}&content=${encodeURIComponent(post.content)}&category=${post.category || 'general'}&tags=${encodeURIComponent((post.tags || []).join(', '))}`
    router.push(editUrl)
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }
    try {
      const { data } = await deletePostMutation({ variables: { id: postId } })
      if (data?.deletePost?.success) {
        toast.success('Post deleted successfully!')
        refetch()
      } else {
        toast.error(data?.deletePost?.message || 'Failed to delete post')
      }
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading posts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error Loading Posts</h2>
          <p>{error.message}</p>
          <button onClick={() => refetch()} className={styles.retryBtn}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {isOwner ? 'My Posts' : `Posts by User`}
        </h1>
        <p className={styles.subtitle}>
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
        </p>
        
        {/* Debug info - remove this later */}
        {/* <div style={{color: 'red', fontSize: '12px', marginTop: '10px'}}>
          Debug: userId={userId}, loading={String(loading)}, error={error?.message}, 
          data={data ? 'exists' : 'null'}, posts.length={posts.length}
          {data?.postsByAuthor && `, graphql_posts=${data.postsByAuthor.length}`}
        </div> */}
        
        {isOwner && (
          <button
            className={styles.createBtn}
            onClick={() => router.push('/create-post')}
          >
            ✏️ Create New Post
          </button>
        )}
      </div>

      <div className={styles.postsGrid}>
        {posts.length === 0 ? (
          <div className={styles.noPosts}>
            <h3>No Posts Found</h3>
            <p>
              {isOwner 
                ? "You haven't created any posts yet. Start writing your first post!" 
                : "This user hasn't published any posts yet."
              }
            </p>
            {isOwner && (
              <button
                className={styles.createFirstBtn}
                onClick={() => router.push('/create-post')}
              >
                Create Your First Post
              </button>
            )}
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              <div className={styles.postHeader}>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <div className={styles.postMeta}>
                  <span className={styles.category}>{post.category}</span>
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

              <div className={styles.postContent}>
                <div
                  className={styles.contentPreview}
                  dangerouslySetInnerHTML={{
                    __html: post.content.length > 200 
                      ? post.content.substring(0, 200) + '...' 
                      : post.content
                  }}
                />
              </div>

              <div className={styles.postActions}>
                <button
                  className={styles.viewBtn}
                  onClick={() => router.push(`/blog/${post.id}`)}
                >
                  👁️ View Post
                </button>

                {isOwner && (
                  <>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEditPost(post)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeletePost(post.id)}
                    >
                      🗑️ Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default UserPostsPage
