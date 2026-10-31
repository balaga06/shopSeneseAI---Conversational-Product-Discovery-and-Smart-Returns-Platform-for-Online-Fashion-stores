import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./Customer.css";

function RecentlyViewed() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/recently-viewed")
      .then((response) => {
        setProducts(response.data || []);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="customer-page">

      <div className="customer-container py-10">

        <h1 className="customer-title">
          Recently Viewed
        </h1>

        <p className="customer-subtitle">
          Continue exploring products you've viewed.
        </p>


        {products.length === 0 ? (

          <div className="customer-empty mt-8">
            <h2 className="text-xl font-bold">
              Nothing here yet
            </h2>

            <p className="text-gray-500 mt-2">
              Products you view will appear here.
            </p>
          </div>

        ) : (

          <div className="customer-grid mt-8">

            {products.map((product) => (

              <Link
                key={product.product_id}
                to={`/customer/products/${product.product_id}`}
                className="customer-card overflow-hidden no-underline text-inherit"
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

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default RecentlyViewed;