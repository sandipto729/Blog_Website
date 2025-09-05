'use client'
import React, { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import styles from './CreatePost.module.scss'
import { useMutation } from '@apollo/client/react';
import { CREATE_POST } from './mutation';


const CreatePost = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [createPost, { loading: mutationLoading, error: mutationError }] = useMutation(CREATE_POST)

  const editorRef = useRef(null)
  const fileInputRef = useRef(null)

  const [postData, setPostData] = useState({
    title: '',
    content: '',
    tags: '',
    category: 'general'
  })
  const [imageUploading, setImageUploading] = useState(false)
  const [activeTools, setActiveTools] = useState({})

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

  // Handle image upload
    const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    setImageUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      
      // Insert image at cursor position
      const editor = editorRef.current
      if (editor) {
        editor.focus()
        const selection = window.getSelection()
        const range = selection.getRangeAt(0)
        
        const img = document.createElement('img')
        img.src = data.url
        img.style.maxWidth = '100%'
        img.style.height = 'auto'
        img.style.margin = '10px 0'
        img.style.borderRadius = '8px'
        
        range.insertNode(img)
        range.collapse(false)
        handleContentChange()
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setImageUploading(false)
      // Reset file input
      e.target.value = ''
    }
  }

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
    alert('Please login to create a post')
    return
  }

  if (!postData.title.trim() || !postData.content.trim()) {
    alert('Please fill in title and content')
    return
  }

  try {
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
      alert('Post created successfully!')
      // Reset form
      setPostData({
        title: '',
        content: '',
        tags: '',
        category: 'general'
      })
      if (editorRef.current) {
        editorRef.current.innerHTML = ''
      }
      router.push('/dashboard')
    } else {
      alert('Error creating post: ' + data.createPost.message)
    }
  } catch (error) {
    console.error('GraphQL Error:', error)
    alert('Network error. Please try again.')
  }
}

  return (
    <div className={styles.container}>
      <div className={styles.createPostCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create New Post</h1>
          <p className={styles.subtitle}>Share your thoughts with the world</p>
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
                >
                  <option value="1">Small</option>
                  <option value="3" selected>Normal</option>
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
                  Publishing...
                </>
              ) : (
                'Publish Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
