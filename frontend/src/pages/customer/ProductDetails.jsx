import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import SizeRecommendation from "../../components/AI/SizeRecommendation";
import ReviewSummary from "../../components/AI/ReviewSummary";
import ProductRecommendation from "../../components/AI/ProductRecommendation";
import "./Customer.css";

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/products/${productId}`);

      setProduct(response.data.product);
      setSizes(response.data.sizes || []);
      setReviews(response.data.reviews || []);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      await api.post("/cart", {
        product_id: Number(productId),
        product_size_id: selectedSize,
        quantity,
      });

      navigate("/customer/cart");
    } catch (error) {
      console.error(error);
      alert("Please login before adding products to cart.");
    }
  };

  const buyNow = async () => {
    await addToCart();
  };

  if (loading) {
    return (
      <div className="customer-page">
        <div className="customer-loading">
          Loading product...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="customer-page">
        <div className="customer-empty">
          <h2 className="text-xl font-bold">
            Product not found
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-page">

      <div className="customer-container py-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* IMAGE */}

          <div className="customer-card overflow-hidden">

            {product.image_url ? (

              <img
                src={product.image_url}
                alt={product.product_name}
                className="w-full h-[600px] object-cover"
              />

            ) : (

              <div className="h-[600px] flex items-center justify-center bg-indigo-50 text-indigo-500 text-7xl">
                ✦
              </div>

            )}

          </div>


          {/* DETAILS */}

          <div>

            <span className="text-indigo-600 font-bold text-sm">
              {product.brand || "ShopSense"}
            </span>

            <h1 className="text-3xl font-extrabold mt-2">
              {product.product_name}
            </h1>

            <p className="text-gray-500 mt-3 leading-7">
              {product.description}
            </p>


            <div className="mt-6">

              <strong className="text-3xl">
                ₹
                {Number(
                  product.discount_price ||
                    product.price
                ).toLocaleString("en-IN")}
              </strong>

              {product.discount_price && (
                <del className="ml-3 text-gray-400">
                  ₹
                  {Number(product.price).toLocaleString(
                    "en-IN"
                  )}
                </del>
              )}

            </div>


            {/* SIZE */}

            <div className="mt-8">

              <div className="flex justify-between mb-3">

                <h3 className="font-bold">
                  Select Size
                </h3>

                <button
                  className="text-indigo-600 text-sm font-bold"
                  onClick={() =>
                    document
                      .getElementById("size-ai")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                >
                  ✦ Find My Size
                </button>

              </div>


              <div className="flex flex-wrap gap-3">

                {sizes.map((size) => (

                  <button
                    key={size.product_size_id}
                    disabled={size.stock <= 0}
                    onClick={() =>
                      setSelectedSize(
                        size.product_size_id
                      )
                    }
                    className={`px-5 py-3 rounded-xl border font-bold ${
                      selectedSize === size.product_size_id
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white border-gray-300"
                    } ${
                      size.stock <= 0
                        ? "opacity-40 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {size.size_code}
                  </button>

                ))}

              </div>

            </div>


            {/* QUANTITY */}

            <div className="mt-7">

              <h3 className="font-bold mb-3">
                Quantity
              </h3>

              <div className="flex items-center border rounded-xl w-fit">

                <button
                  className="px-4 py-2"
                  onClick={() =>
                    setQuantity(
                      Math.max(1, quantity - 1)
                    )
                  }
                >
                  −
                </button>

                <span className="px-5 font-bold">
                  {quantity}
                </span>

                <button
                  className="px-4 py-2"
                  onClick={() =>
                    setQuantity(quantity + 1)
                  }
                >
                  +
                </button>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="flex gap-3 mt-8">

              <button
                className="customer-button flex-1"
                onClick={addToCart}
              >
                Add to Cart
              </button>

              <button
                className="customer-button secondary flex-1"
                onClick={buyNow}
              >
                Buy Now
              </button>

            </div>


            {/* AI SIZE */}

            <div id="size-ai" className="mt-8">

              <SizeRecommendation
                productId={product.product_id}
                sizes={sizes}
              />

            </div>

          </div>

        </div>


        {/* REVIEW AI */}

        <div className="mt-12">

          <ReviewSummary
            productId={product.product_id}
            reviews={reviews}
          />

        </div>


        {/* REVIEWS */}

        <div className="customer-card p-6 mt-6">

          <h2 className="text-xl font-bold mb-5">
            Customer Reviews
          </h2>

          {reviews.length === 0 ? (

            <p className="text-gray-500">
              No reviews yet.
            </p>

          ) : (

            <div className="space-y-5">

              {reviews.map((review) => (

                <div
                  key={review.review_id}
                  className="border-b pb-5"
                >

                  <div className="font-bold">
                    {"★".repeat(review.rating)}
                  </div>

                  <p className="mt-2 text-gray-600">
                    {review.review_text}
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* RECOMMENDATIONS */}

        <div className="mt-12">

          <ProductRecommendation
            productId={product.product_id}
          />

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;