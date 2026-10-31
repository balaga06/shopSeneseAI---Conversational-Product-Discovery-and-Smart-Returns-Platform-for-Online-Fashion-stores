import { useState } from "react"

function SizeRecommendation() {
  const [measurements, setMeasurements] = useState({
    height: "",
    weight: "",
    chest: "",
    waist: "",
    fit: "Regular",
  })

  const [result, setResult] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target

    setMeasurements((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const getSizeRecommendation = () => {
    const height = Number(measurements.height)
    const weight = Number(measurements.weight)
    const chest = Number(measurements.chest)
    const waist = Number(measurements.waist)

    if (!height || !weight || !chest || !waist) {
      alert("Please enter all measurements.")
      return
    }

    let size = "M"
    let confidence = 84

    if (chest <= 92 && waist <= 78) {
      size = "S"
      confidence = 88
    } else if (chest <= 100 && waist <= 86) {
      size = "M"
      confidence = 91
    } else if (chest <= 108 && waist <= 94) {
      size = "L"
      confidence = 89
    } else {
      size = "XL"
      confidence = 87
    }

    if (measurements.fit === "Relaxed" && size === "M") {
      size = "L"
      confidence = 86
    }

    if (measurements.fit === "Slim" && size === "L") {
      size = "M"
      confidence = 84
    }

    setResult({
      size,
      confidence,
    })
  }

  const resetRecommendation = () => {
    setMeasurements({
      height: "",
      weight: "",
      chest: "",
      waist: "",
      fit: "Regular",
    })

    setResult(null)
  }

  return (
    <div className="bg-white border border-purple-200 rounded-2xl p-6 shadow-sm">

      {/* Header */}
      <div className="flex items-start gap-4">

        <div className="bg-purple-100 rounded-xl p-3 text-2xl">
          🤖
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            AI Size Recommendation
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Tell us your measurements and preferred fit.
            Our AI will recommend the most suitable size.
          </p>
        </div>

      </div>


      {/* Measurement Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Height (cm)
          </label>

          <input
            type="number"
            name="height"
            value={measurements.height}
            onChange={handleChange}
            placeholder="Example: 175"
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight (kg)
          </label>

          <input
            type="number"
            name="weight"
            value={measurements.weight}
            onChange={handleChange}
            placeholder="Example: 72"
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chest (cm)
          </label>

          <input
            type="number"
            name="chest"
            value={measurements.chest}
            onChange={handleChange}
            placeholder="Example: 98"
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Waist (cm)
          </label>

          <input
            type="number"
            name="waist"
            value={measurements.waist}
            onChange={handleChange}
            placeholder="Example: 82"
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

      </div>


      {/* Fit Preference */}
      <div className="mt-4">

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Fit
        </label>

        <select
          name="fit"
          value={measurements.fit}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="Regular">Regular Fit</option>
          <option value="Relaxed">Relaxed Fit</option>
          <option value="Slim">Slim Fit</option>
          <option value="Oversized">Oversized</option>
        </select>

      </div>


      {/* Buttons */}
      <div className="flex gap-3 mt-6">

        <button
          onClick={getSizeRecommendation}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
        >
          🤖 Find My Size
        </button>

        {result && (
          <button
            onClick={resetRecommendation}
            className="px-5 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
        )}

      </div>


      {/* AI Result */}
      {result && (

        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-5">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-sm text-gray-500">
                AI Recommended Size
              </p>

              <p className="text-5xl font-bold text-purple-700 mt-1">
                {result.size}
              </p>
            </div>


            <div className="text-right">

              <p className="text-sm text-gray-500">
                Confidence
              </p>

              <p className="text-2xl font-bold text-green-600">
                {result.confidence}%
              </p>

            </div>

          </div>


          <div className="mt-5 space-y-2 text-sm text-gray-700">

            <p>✓ Your body measurements were considered</p>

            <p>✓ Your preferred fit was considered</p>

            <p>✓ Product size information will be considered</p>

          </div>


          <div className="mt-5 bg-white rounded-lg p-4">

            <p className="font-semibold text-gray-800">
              🎯 Why this size?
            </p>

            <p className="text-sm text-gray-600 mt-1">
              Based on your measurements and preferred fit,
              size {result.size} is currently the best match.
            </p>

          </div>


          <p className="text-xs text-purple-700 mt-4">
            AI size recommendations are designed to help reduce
            size and fit related returns.
          </p>

        </div>

      )}

    </div>
  )
}

export default SizeRecommendation