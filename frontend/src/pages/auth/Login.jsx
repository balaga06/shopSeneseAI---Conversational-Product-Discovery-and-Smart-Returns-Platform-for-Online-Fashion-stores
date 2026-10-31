import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../../services/api"
import { useAuth } from "../../context/AuthContext"

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()

    setError("")
    setLoading(true)

    try {
      // Send login request to FastAPI
      const response = await api.post("/auth/login", {
        email: email,
        password: password,
      })

      const data = response.data

      // Store authentication information through AuthContext
      login(data)

      // Get trusted role returned by backend
      const role = data.user.role

      // Redirect based on role
      if (role === "CUSTOMER") {
        navigate("/customer/home")
      } else if (role === "SELLER") {
        navigate("/seller/dashboard")
      } else if (role === "SUPPORT_AGENT") {
        navigate("/support/dashboard")
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard")
      } else {
        setError("Invalid user role")
      }

    } catch (error) {
      console.error("Login error:", error)

      if (error.response) {
        setError(
          error.response.data?.detail ||
          "Invalid email or password"
        )
      } else if (error.request) {
        setError(
          "Unable to connect to the server. Please make sure the backend is running."
        )
      } else {
        setError("Something went wrong. Please try again.")
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Header */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-purple-600">
            ShopSense AI
          </h1>

          <p className="text-gray-500 mt-2">
            Sign in to your account
          </p>

        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>

          {/* Email */}
          <div className="mb-5">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />

          </div>

          {/* Password */}
          <div className="mb-4">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />

          </div>

          {/* Forgot Password */}
          <div className="text-right mb-6">

            <Link
              to="/forgot-password"
              className="text-sm text-purple-600 hover:underline"
            >
              Forgot Password?
            </Link>

          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register */}
        <p className="text-center text-gray-600 mt-6">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-purple-600 font-semibold hover:underline"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  )
}

export default Login