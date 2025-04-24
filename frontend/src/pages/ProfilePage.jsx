import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore.js'
import { Camera, Mail, User } from 'lucide-react'

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore()
  const [selectedImage, setSelectedImage] = useState(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = async () => {
      const base64Image = reader.result
      setSelectedImage(base64Image)
      await updateProfile({ profilePic: base64Image })
    }
  }

  return (
    <div>
      <div>
        <div>
          <div>
            <h1>Profile</h1>
            <p>Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div>
            <div>
              <img
                src={selectedImage || authUser.profilePic || '/avatar.png'}
                alt="Profile"
              />
              <label
                htmlFor='avatar-upload'
              >

                <Camera />
                <input
                  type="file"
                  id='avatar-upload'
                  className='hidden'
                  accept='image/*'
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p>
              {isUpdatingProfile ? 'Uploading...' : 'Click the camera icon to update your photo'}

            </p>
          </div>

          <div>
            <div>
              <div>
                <User />
                Full Name
              </div>
              <p>{authUser?.fullName}</p>
            </div>

            <div>
              <div>
                <Mail className='size-4' />
                Email
              </div>
              <p>{authUser?.email}</p>
            </div>
          </div>

          <div>
            <h2>Account Information</h2>
            <div>
              <div>
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>

              <div>
                <span>Account Status</span>
                <span>Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProfilePage