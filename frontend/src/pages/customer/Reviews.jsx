import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Customer.css";

function Reviews() {
  const [products, setProducts] = useState([]);
  const [review, setReview] = useState({
    product_id: "",
    order_item_id: "",
    rating: 5,
    review_text: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviewableProducts();
  }, []);

  const loadReviewableProducts = async () => {
    try {
      const response = await api.get(
        "/reviews/reviewable-products"
      );

      setProducts(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();

    try {

      await api.post("/reviews", review);

      alert("Review submitted successfully.");

      setReview({
        product_id: "",
        order_item_id: "",
        rating: 5,
        review_text: "",
      });

    } catch (error) {
      console.error(error);
      alert("Unable to submit review.");
    }
  };

  return (
    <div className="customer-page">

      <div className="customer-container py-10 max-w-4xl">

        <h1 className="customer-title">
          Reviews
        </h1>

        <p className="customer-subtitle">
          Share your experience and help other customers.
        </p>


        <form
          onSubmit={submitReview}
          className="customer-card p-6 mt-8"
        >

          <label className="block text-sm font-bold mb-2">
            Product
          </label>

          <select
            className="customer-select"
            value={review.product_id}
            onChange={(e) =>
              setReview({
                ...review,
                product_id: e.target.value,
              })
            }
            required
          >
            <option value="">
              Select Product
            </option>

            {products.map((product) => (

              <option
                key={product.product_id}
                value={product.product_id}
              >
                {product.product_name}
              </option>

            ))}

          </select>


          <label className="block text-sm font-bold mt-6 mb-2">
            Rating
          </label>

          <select
            className="customer-select"
            value={review.rating}
            onChange={(e) =>
              setReview({
                ...review,
                rating: Number(e.target.value),
              })
            }
          >
            <option value="5">★★★★★ - Excellent</option>
            <option value="4">★★★★ - Good</option>
            <option value="3">★★★ - Average</option>
            <option value="2">★★ - Poor</option>
            <option value="1">★ - Very Poor</option>
          </select>


          <label className="block text-sm font-bold mt-6 mb-2">
            Review
          </label>

          <textarea
            className="customer-textarea"
            placeholder="Tell us about your experience..."
            value={review.review_text}
            onChange={(e) =>
              setReview({
                ...review,
                review_text: e.target.value,
              })
            }
            required
          />


          <button className="customer-button mt-6">
            Submit Review
          </button>

        </form>


        {loading && (
          <div className="customer-loading">
            Loading...
          </div>
        )}

      </div>

    </div>
  );
}

export default Reviews;