import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./Customer.css";

function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const response = await api.get("/wishlist");
      setProducts(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      loadWishlist();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="customer-page">

      <div className="customer-container py-10">

        <h1 className="customer-title">
          Wishlist
        </h1>

        <p className="customer-subtitle">
          Products you want to keep for later.
        </p>


        {loading ? (

          <div className="customer-loading">
            Loading wishlist...
          </div>

        ) : products.length === 0 ? (

          <div className="customer-empty mt-8">
            <div className="text-5xl">
              ♡
            </div>

            <h2 className="text-xl font-bold mt-4">
              Your wishlist is empty
            </h2>
          </div>

        ) : (

          <div className="customer-grid mt-8">

            {products.map((product) => (

              <div
                key={product.product_id}
                className="customer-card overflow-hidden"
              >

                <Link
                  to={`/customer/products/${product.product_id}`}
                  className="block"
                >

                  <div className="h-64 bg-gray-100">

                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.product_name}
                        className="w-full h-full object-cover"
                      />
                    )}

                  </div>

                </Link>

                <div className="p-4">

                  <h3 className="font-bold">
                    {product.product_name}
                  </h3>

                  <strong className="block mt-2">
                    ₹
                    {Number(
                      product.discount_price ||
                        product.price
                    ).toLocaleString("en-IN")}
                  </strong>

                  <button
                    className="customer-button danger mt-4 w-full"
                    onClick={() =>
                      remove(product.product_id)
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Wishlist;