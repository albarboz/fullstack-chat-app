import React, { useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore.js'
import { Lock, MessageSquare, Loader2, Eye, EyeOff, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
// import AuthImagePattern from '../components/AuthImagePattern.jsx'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { login, isLoggingIn } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    login(formData)
  }

  return (
    <div>

      {/* Left side */}
      <div>
        <div>

          {/* LOGO */}
          <div>
            <div>
              <div>
                <MessageSquare />
              </div>
              <h1>Welcome Back</h1>
              <p>Sign in to your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Email input */}
            <div>
              <label>
                <span>Email</span>
              </label>
              <div>
                <div>
                  <Mail />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  autoComplete="email"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password input  */}
            <div>
              <label>
                <span>Password</span>
              </label>
              <div>
                <div>
                  <Lock />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  autoComplete="current-password"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  // ARIA label improves accessibility by describing the button's function.
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff />
                  ) : (
                    <Eye />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 />
                  Loading...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div>
            <p>
              Don&apos;t have an account?{" "}
              <Link to="/signup">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side: hidden on mobile */}
      {/* <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      /> */}
    </div>
  )
}

export default LoginPage