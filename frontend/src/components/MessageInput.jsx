import React, { useState, useRef } from 'react'
import { useChatStore } from '../store/useChatStore.js'
import { Image, X } from 'lucide-react'
import toast from 'react-hot-toast'
import sendIcon from '../assets/send.svg'  // ← this gives you a URL string


const MessageInput = () => {
  const [text, setText] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const { sendChatMessage } = useChatStore()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith("image/")) {
      toast.error('Please select an image file')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSendChatMessage = async (e) => {
    e.preventDefault()
    if (!text.trim() && !imagePreview) return
    try {
      await sendChatMessage({
        text: text.trim(),
        image: imagePreview
      })
      setText('')
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div className='message-input-container'>
      {imagePreview && (
        <div>
          <div>
            <img
              src={imagePreview}
              alt='Preview'
            />
            <button
              onClick={removeImage}
              type='button'
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendChatMessage} className='message-input-form-container'>
        <input
          type="text"
          placeholder='Message...'
          value={text}
          onChange={(e) => setText(e.target.value)}
          className='message-input'
        />

        {/* <input
          type="file"
          accept='image/*'
          className='hidden'
          ref={fileInputRef}
          onChange={handleImageChange}
        /> */}

        {/* image button */}
        {/* <button
          type='button'
          className='btn btn-circle'
          onClick={() => fileInputRef.current?.click()}
        >
          <Image size={20} />
        </button> */}


        {/* submit button */}
        <div className='svg-container'>

        </div>
        <button
          type="submit"
          className="btn btn-circle send-mask"
          disabled={!text.trim() && !imagePreview}
        >
          <span className="icon" />

        </button>
      </form>
    </div>
  )
}

export default MessageInput
