import { Link } from "react-router-dom"

function ProductRecommendation({
  title = "Recommended For You",
  products = [],
}) {

  /*
    Later these products will come from:

    React
       ↓
    FastAPI
       ↓
    Recommendation Model
       ↓
    MySQL
       ↓
    Recommended Products
  */

  const defaultProducts = [
    {
      id: 1,
      name: "Black Relaxed Fit Shirt",
      price: 1199,
      rating: 4.6,
      category: "Shirts",
      match: 94,
    },
    {
      id: 2,
      name: "Beige Casual Trousers",
      price: 1299,
      rating: 4.5,
      category: "Trousers",
      match: 91,
    },
    {
      id: 3,
      name: "Black Casual Sneakers",
      price: 1799,
      rating: 4.7,
      category: "Footwear",
      match: 89,
    },
    {
      id: 4,
      name: "Minimal Classic Watch",
      price: 1499,
      rating: 4.4,
      category: "Accessories",
      match: 86,
    },
  ]

  const recommendedProducts =
    products.length > 0 ? products : defaultProducts

  return (
    <section className="mt-8">

      {/* Section Header */}
      <div className="flex justify-between items-center">

        <div>

          <div className="flex items-center gap-2">

            <span className="text-2xl">
              🤖
            </span>

            <h2 className="text-2xl font-bold text-gray-900">
              {title}
            </h2>

          </div>

          <p className="text-sm text-gray-500 mt-1">
            AI-powered recommendations based on your interests
            and shopping activity.
          </p>

        </div>

      </div>


      {/* Products */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">

        {recommendedProducts.map((product) => (

          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
          >

            {/* Product Image Placeholder */}
            <div className="h-52 bg-gray-100 flex items-center justify-center">

              <span className="text-6xl">
                👕
              </span>

            </div>


            {/* Product Details */}
            <div className="p-4">

              <p className="text-xs text-gray-500">
                {product.category}
              </p>

              <h3 className="font-semibold text-gray-900 mt-1">
                {product.name}
              </h3>


              {/* Rating */}
              <div className="flex items-center gap-1 mt-2">

                <span className="text-yellow-500">
                  ⭐
                </span>

                <span className="text-sm text-gray-600">
                  {product.rating}
                </span>

              </div>


              {/* Price */}
              <p className="text-lg font-bold text-gray-900 mt-2">
                ₹{product.price}
              </p>


              {/* AI Match */}
              <div className="mt-3">

                <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                  ✨ {product.match}% AI Match
                </span>

              </div>

            </div>

          </Link>

        ))}

      </div>


      {/* AI Explanation */}
      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-4">

        <p className="text-sm text-purple-800">

          💡 <strong>Why these products?</strong>{" "}
          ShopSense AI considers your browsing activity,
          wishlist, previous purchases, product category,
          price range and preferences to recommend relevant
          products.

        </p>

      </div>

    </section>
  )
}

export default ProductRecommendation