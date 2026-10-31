import { useState } from "react"

function ReviewSummary({ productName = "This Product" }) {

  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState(null)

  const generateSummary = () => {

    setLoading(true)

    /*
      Temporary frontend simulation.

      Later:

      React
        ↓
      FastAPI
        ↓
      MySQL Reviews
        ↓
      GenAI / LLM
        ↓
      Review Summary
    */

    setTimeout(() => {

      setSummary({
        overall:
          "Customers generally like the product for its comfort, appearance and fabric quality. Most customers found the fit comfortable for regular use.",

        pros: [
          "Comfortable fabric",
          "Good appearance",
          "Good value for money",
          "Suitable for casual occasions",
        ],

        cons: [
          "Some customers found the sleeves slightly long",
          "Color may look slightly different in some lighting",
        ],

        fit:
          "Most customers say the product fits true to size. Customers who prefer a relaxed look may consider going one size up.",
      })

      setLoading(false)

    }, 1000)
  }

  return (
    <div className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm">

      {/* Header */}
      <div className="flex items-start gap-4">

        <div className="bg-blue-100 rounded-xl p-3 text-2xl">
          ✨
        </div>

        <div>

          <h2 className="text-xl font-bold text-gray-900">
            AI Review Summary
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Quickly understand what customers think about{" "}
            <span className="font-medium text-gray-700">
              {productName}
            </span>
            .
          </p>

        </div>

      </div>


      {/* Generate Button */}
      {!summary && (

        <button
          onClick={generateSummary}
          disabled={loading}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition"
        >
          {loading
            ? "✨ Analyzing customer reviews..."
            : "✨ Summarize Reviews with AI"}
        </button>

      )}


      {/* Loading */}
      {loading && (

        <div className="mt-5 bg-blue-50 rounded-xl p-5 text-center">

          <div className="text-3xl">
            🤖
          </div>

          <p className="text-sm text-gray-600 mt-2">
            AI is analyzing customer reviews...
          </p>

        </div>

      )}


      {/* Summary */}
      {summary && (

        <div className="mt-6">

          {/* Overall */}
          <div className="bg-blue-50 rounded-xl p-5">

            <p className="font-bold text-gray-900">
              🤖 AI Summary
            </p>

            <p className="text-sm text-gray-700 mt-2 leading-6">
              {summary.overall}
            </p>

          </div>


          {/* Pros and Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

            {/* Pros */}
            <div className="border border-green-200 rounded-xl p-5">

              <h3 className="font-bold text-green-700">
                👍 What customers like
              </h3>

              <ul className="mt-3 space-y-2">

                {summary.pros.map((item, index) => (

                  <li
                    key={index}
                    className="text-sm text-gray-700"
                  >
                    ✓ {item}
                  </li>

                ))}

              </ul>

            </div>


            {/* Cons */}
            <div className="border border-red-200 rounded-xl p-5">

              <h3 className="font-bold text-red-700">
                👎 What customers mention
              </h3>

              <ul className="mt-3 space-y-2">

                {summary.cons.map((item, index) => (

                  <li
                    key={index}
                    className="text-sm text-gray-700"
                  >
                    • {item}
                  </li>

                ))}

              </ul>

            </div>

          </div>


          {/* Fit Feedback */}
          <div className="mt-5 border border-purple-200 bg-purple-50 rounded-xl p-5">

            <h3 className="font-bold text-purple-700">
              📏 AI Fit Feedback
            </h3>

            <p className="text-sm text-gray-700 mt-2">
              {summary.fit}
            </p>

          </div>


          {/* Reset */}
          <button
            onClick={() => setSummary(null)}
            className="mt-5 text-sm text-blue-600 hover:underline"
          >
            Generate summary again
          </button>

        </div>

      )}

    </div>
  )
}

export default ReviewSummary