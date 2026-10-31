import { Link } from "react-router-dom"

function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-600">
            Forgot Password?
          </h1>

          <p className="text-gray-500 mt-2">
            Enter your email to reset your password
          </p>
        </div>

        <form>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your registered email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            Send Reset Link
          </button>

        </form>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-purple-600 font-semibold hover:underline"
          >
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  )
}

export default ForgotPassword