import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./Customer.css";

function AISearch() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [explanation, setExplanation] = useState("");

  const [loading, setLoading] = useState(false);

  const searchProducts = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    try {
      setLoading(true);

      const response = await api.post("/ai/search", {
        query: query.trim(),
      });

      setProducts(response.data.products || []);
      setExplanation(response.data.explanation || "");

    } catch (error) {
      console.error(error);
      setProducts([]);
      setExplanation(
        "Unable to process your AI search right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-page">

      <div className="customer-container py-10">

        <div className="max-w-3xl mx-auto text-center">

          <div className="inline-block px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
            ✦ SHOP SENSE AI
          </div>

          <h1 className="text-4xl font-extrabold mt-5">
            What are you looking for?
          </h1>

          <p className="text-gray-500 mt-3">
            Describe your style naturally. AI will find
            products from the real ShopSense catalogue.
          </p>


          <form
            onSubmit={searchProducts}
            className="mt-8 flex bg-white border rounded-2xl overflow-hidden shadow-lg"
          >

            <input
              className="flex-1 px-5 py-4 outline-none"
              placeholder='Example: "Relaxed party outfit under ₹2000"'
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
            />

            <button
              className="customer-button rounded-none px-7"
              type="submit"
            >
              {loading ? "Thinking..." : "Ask AI"}
            </button>

          </form>

        </div>


        {explanation && (

          <div className="customer-card max-w-4xl mx-auto mt-8 p-5">

            <div className="text-indigo-600 font-bold text-sm">
              ✦ AI understands
            </div>

            <p className="mt-2 text-gray-700">
              {explanation}
            </p>

          </div>

        )}


        <div className="mt-10">

          {products.length > 0 ? (

            <div className="customer-grid">

              {products.map((product) => (

                <Link
                  key={product.product_id}
                  to={`/customer/products/${product.product_id}`}
                  className="customer-card overflow-hidden text-inherit no-underline"
                >

                  <div className="h-64 bg-gray-100">

                    {product.image_url ? (

                      <img
                        src={product.image_url}
                        alt={product.product_name}
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <div className="h-full flex items-center justify-center bg-indigo-50 text-indigo-500 text-5xl">
                        ✦
                      </div>

                    )}

                  </div>

                  <div className="p-4">

                    <h3 className="font-bold">
                      {product.product_name}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      {product.description}
                    </p>

                    <strong className="block mt-3">
                      ₹
                      {Number(
                        product.discount_price ||
                          product.price
                      ).toLocaleString("en-IN")}
                    </strong>

                  </div>

                </Link>

              ))}

            </div>

          ) : !loading ? (

            <div className="customer-empty">

              <div className="text-4xl text-indigo-500">
                ✦
              </div>

              <h3 className="text-xl font-bold mt-3">
                Start with a natural request
              </h3>

              <p className="text-gray-500 mt-2">
                Try describing an outfit, budget,
                occasion or style.
              </p>

            </div>

          ) : null}

        </div>

      </div>

    </div>
  );
}

export default AISearch;