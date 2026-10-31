import { Link } from "react-router-dom"

function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          403
        </h1>

        <h2 className="text-2xl font-semibold mb-2">
          Unauthorized Access
        </h2>

        <p className="text-gray-600 mb-6">
          You do not have permission to access this page.
        </p>

        <Link
          to="/login"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg"
        >
          Go to Login
        </Link>
      </div>
    </div>
  )
}

export default Unauthorized