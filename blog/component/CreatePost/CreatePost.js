'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './CreatePost.module.scss'
import { useMutation } from '@apollo/client/react';
import { CREATE_POST } from './mutation';
import {POST_EDIT} from './mutation';
import { isNSFWImage } from '@/lib/nsfwCheck';
import toast from 'react-hot-toast';


const CreatePost = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [createPost, { loading: mutationLoading, error: mutationError }] = useMutation(CREATE_POST)
  const [updatePost, { loading: updateLoading, error: updateError }] = useMutation(POST_EDIT)

  const editorRef = useRef(null)
  const fileInputRef = useRef(null)

  // SSR-safe edit mode detection
  const [isEditMode, setIsEditMode] = useState(false)
  const [editPostId, setEditPostId] = useState(null)
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    tags: '',
    category: 'general'
  })
  const [imageUploading, setImageUploading] = useState(false)
  const [activeTools, setActiveTools] = useState({})

  // Pre-fill form data and detect edit mode after mount
  useEffect(() => {
    const edit = searchParams.get('edit') === 'true'
    const postId = searchParams.get('postId')
    setIsEditMode(edit)
    setEditPostId(postId)

    if (edit && searchParams.get('title')) {
      let urlTitle = ''
      let urlContent = ''
      let urlTags = ''
      let urlCategory = 'general'
      try {
        urlTitle = decodeURIComponent(searchParams.get('title') || '')
      } catch (e) {
        urlTitle = searchParams.get('title') || ''
      }
      try {
        urlContent = decodeURIComponent(searchParams.get('content') || '')
      } catch (e) {
        urlContent = searchParams.get('content') || ''
      }
      try {
        urlTags = decodeURIComponent(searchParams.get('tags') || '')
      } catch (e) {
        urlTags = searchParams.get('tags') || ''
      }
      try {
        urlCategory = decodeURIComponent(searchParams.get('category') || 'general')
      } catch (e) {
        urlCategory = searchParams.get('category') || 'general'
      }

      setPostData({
        title: urlTitle,
        content: urlContent,
        tags: urlTags,
        category: urlCategory
      })

      // Set editor content after a brief delay to ensure it's rendered
      setTimeout(() => {
        if (editorRef.current && urlContent) {
          editorRef.current.innerHTML = urlContent
        }
      }, 100)
    }
  }, [isEditMode, searchParams])

  // Use mutation loading state
  const isLoading = mutationLoading

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPostData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Update content from editor
  const handleContentChange = () => {
    if (editorRef.current) {
      setPostData(prev => ({
        ...prev,
        content: editorRef.current.innerHTML
      }))
    }
  }

  // Execute formatting commands
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current.focus()
    handleContentChange()
    
    // Update active tools state for styling
    updateActiveTools()
  }

  // Update active formatting tools
  const updateActiveTools = () => {
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      setActiveTools({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        subscript: document.queryCommandState('subscript'),
        superscript: document.queryCommandState('superscript')
      })
    }
  }


  // Handle image upload with NSFW check
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) {
    toast.error('Please select an image file');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error('File size must be less than 5MB');
    return;
  }

  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file');
    return;
  }

  setImageUploading(true);

  const uploadPromise = (async () => {
    // Convert File to HTMLImageElement for NSFW check
    const imageUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.src = imageUrl;
    img.crossOrigin = 'anonymous';

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    // Show the values for debugging
    console.log('NSFW check image:', img);

    // NSFW check
    const isNSFW = await isNSFWImage(img);
    URL.revokeObjectURL(imageUrl);

    if (isNSFW) {
      throw new Error('This image contains inappropriate content and cannot be uploaded.');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();

    // Insert image at cursor position
    const editor = editorRef.current;
    if (editor) {
      editor.focus();
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);

      const imgElement = document.createElement('img');
      imgElement.src = data.url;
      imgElement.style.maxWidth = '100%';
      imgElement.style.height = 'auto';
      imgElement.style.margin = '10px 0';
      imgElement.style.borderRadius = '8px';

      range.insertNode(imgElement);
      range.collapse(false);
      handleContentChange();
    }
    return 'Image uploaded successfully!';
  })();

  toast.promise(
    uploadPromise,
    {
      loading: 'Checking and uploading image...',
      success: 'Image uploaded successfully!',
      error: (err) => err.message || 'Failed to upload image',
    }
  );

  try {
    await uploadPromise;
  } catch (error) {
    // error handled by toast
    console.error('Upload error:', error);
  } finally {
    setImageUploading(false);
    e.target.value = '';
  }
};

  // Insert link
  const insertLink = () => {
    const url = prompt('Enter the URL:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  // Change font size
  const changeFontSize = (size) => {
    execCommand('fontSize', size)
  }

  // Change text color
  const changeTextColor = (color) => {
    execCommand('foreColor', color)
  }

  // Change background color
  const changeBackgroundColor = (color) => {
    execCommand('backColor', color)
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  
  if (!session) {
    toast.error('Please login to create a post')
    return
  }

  if (!postData.title.trim() || !postData.content.trim()) {
    toast.error('Please fill in title and content')
    return
  }

  const mutationPromise = (async () => {
    if (isEditMode && editPostId) {
      // Update existing post
      const { data } = await updatePost({
        variables: {
          id: editPostId,
          input: {
            title: postData.title,
            content: postData.content,
            tags: postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            category: postData.category
          }
        }
      });

      if (data.updatePost.success) {
        // Navigate after a short delay to show success toast
        setTimeout(() => {
          router.push(`/post/${session?.user?.id}`)
        }, 1500)
        
        return 'Post updated successfully!'
      } else {
        throw new Error(data.updatePost.message || 'Failed to update post')
      }
    } else {
      // Create new post
      const { data } = await createPost({
        variables: {
          input: {
            title: postData.title,
            content: postData.content,
            tags: postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            category: postData.category
          }
        }
      });

      if (data.createPost.success) {
        // Reset form only if not in edit mode
        setPostData({
          title: '',
          content: '',
          tags: '',
          category: 'general'
        })
        if (editorRef.current) {
          editorRef.current.innerHTML = ''
        }
        
        // Navigate after a short delay to show success toast
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
        
        return 'Post created successfully!'
      } else {
        throw new Error(data.createPost.message || 'Failed to create post')
      }
    }
  })()

  toast.promise(
    mutationPromise,
    {
      loading: isEditMode ? 'Updating your post...' : 'Publishing your post...',
      success: isEditMode ? 'Post updated successfully! 🎉' : 'Post published successfully! 🎉',
      error: (err) => err.message || 'Network error. Please try again.'
    }
  )
}

  return (
    <div className={styles.container}>
      <div className={styles.createPostCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {isEditMode ? 'Edit Post' : 'Create New Post'}
          </h1>
          <p className={styles.subtitle}>
            {isEditMode ? 'Update your post content' : 'Share your thoughts with the world'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Post Title */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Post Title</label>
            <input
              type="text"
              name="title"
              value={postData.title}
              onChange={handleInputChange}
              placeholder="Enter your post title..."
              className={styles.titleInput}
              required
            />
          </div>

          {/* Category and Tags */}
          <div className={styles.metaRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Category</label>
              <select
                name="category"
                value={postData.category}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="general">General</option>
                <option value="technology">Technology</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="travel">Travel</option>
                <option value="food">Food</option>
                <option value="health">Health</option>
                <option value="business">Business</option>
              </select>
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Tags</label>
              <input
                type="text"
                name="tags"
                value={postData.tags}
                onChange={handleInputChange}
                placeholder="react, javascript, web development"
                className={styles.input}
              />
            </div>
          </div>

          {/* Rich Text Editor Toolbar */}
          <div className={styles.editorContainer}>
            <label className={styles.label}>Post Content</label>
            
            <div className={styles.toolbar}>
              {/* Text Formatting */}
              <div className={styles.toolGroup}>
                <button
                  type="button"
                  className={`${styles.toolBtn} ${activeTools.bold ? styles.active : ''}`}
                  onClick={() => execCommand('bold')}
                  title="Bold"
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  className={`${styles.toolBtn} ${activeTools.italic ? styles.active : ''}`}
                  onClick={() => execCommand('italic')}
                  title="Italic"
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  className={`${styles.toolBtn} ${activeTools.underline ? styles.active : ''}`}
                  onClick={() => execCommand('underline')}
                  title="Underline"
                >
                  <u>U</u>
                </button>
                <button
                  type="button"
                  className={`${styles.toolBtn} ${activeTools.strikeThrough ? styles.active : ''}`}
                  onClick={() => execCommand('strikeThrough')}
                  title="Strike Through"
                >
                  <s>S</s>
                </button>
              </div>

              {/* Font Size */}
              <div className={styles.toolGroup}>
                <select
                  onChange={(e) => changeFontSize(e.target.value)}
                  className={styles.fontSizeSelect}
                  title="Font Size"
                  defaultValue="3"
                >
                  <option value="1">Small</option>
                  <option value="3">Normal</option>
                  <option value="5">Large</option>
                  <option value="7">Extra Large</option>
                </select>
              </div>

              {/* Colors */}
              <div className={styles.toolGroup}>
                <input
                  type="color"
                  onChange={(e) => changeTextColor(e.target.value)}
                  className={styles.colorPicker}
                  title="Text Color"
                />
                <input
                  type="color"
                  onChange={(e) => changeBackgroundColor(e.target.value)}
                  className={styles.colorPicker}
                  title="Background Color"
                />
              </div>

              {/* Alignment */}
              <div className={styles.toolGroup}>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => execCommand('justifyLeft')}
                  title="Align Left"
                >
                  ⬅
                </button>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => execCommand('justifyCenter')}
                  title="Align Center"
                >
                  ⬆
                </button>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => execCommand('justifyRight')}
                  title="Align Right"
                >
                  ➡
                </button>
              </div>

              {/* Lists */}
              <div className={styles.toolGroup}>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => execCommand('insertUnorderedList')}
                  title="Bullet List"
                >
                  • List
                </button>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => execCommand('insertOrderedList')}
                  title="Numbered List"
                >
                  1. List
                </button>
              </div>

              {/* Links and Images */}
              <div className={styles.toolGroup}>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={insertLink}
                  title="Insert Link"
                >
                  🔗
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => fileInputRef.current.click()}
                  disabled={imageUploading}
                  title={imageUploading ? 'Uploading...' : 'Insert Image'}
                >
                  {imageUploading ? '⏳' : '📷'}
                </button>
              </div>

              {/* Formatting */}
              <div className={styles.toolGroup}>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => execCommand('formatBlock', 'h1')}
                  title="Heading 1"
                >
                  H1
                </button>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => execCommand('formatBlock', 'h2')}
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => execCommand('formatBlock', 'p')}
                  title="Paragraph"
                >
                  P
                </button>
              </div>
            </div>

            {/* Rich Text Editor */}
            <div
              ref={editorRef}
              contentEditable
              className={styles.editor}
              onInput={handleContentChange}
              onKeyUp={updateActiveTools}
              onMouseUp={updateActiveTools}
              placeholder="Start writing your post..."
              suppressContentEditableWarning={true}
            />
          </div>

          {/* Submit Button */}
          <div className={styles.submitSection}>
            <button
              type="submit"
              disabled={isLoading}
              className={`${styles.submitBtn} ${isLoading ? styles.loading : ''}`}
            >
              {isLoading ? (
                <>
                  <span className={styles.spinner}></span>
                  {isEditMode ? 'Updating...' : 'Publishing...'}
                </>
              ) : (
                isEditMode ? 'Update Post' : 'Publish Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
