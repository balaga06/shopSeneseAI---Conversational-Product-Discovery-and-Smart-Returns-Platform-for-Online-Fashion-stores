import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./Customer.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-page">

      <div className="customer-container py-10">

        <h1 className="customer-title">
          My Orders
        </h1>

        <p className="customer-subtitle">
          Track your purchases and manage returns.
        </p>

        {loading ? (

          <div className="customer-loading">
            Loading orders...
          </div>

        ) : orders.length === 0 ? (

          <div className="customer-empty mt-8">
            <h2 className="text-xl font-bold">
              No orders yet
            </h2>

            <Link
              to="/customer/products"
              className="customer-button inline-block mt-5 no-underline"
            >
              Start Shopping
            </Link>
          </div>

        ) : (

          <div className="space-y-4 mt-8">

            {orders.map((order) => (

              <div
                key={order.order_id}
                className="customer-card p-5"
              >

                <div className="flex flex-wrap justify-between gap-4">

                  <div>

                    <span className="text-xs text-gray-500">
                      ORDER
                    </span>

                    <h3 className="font-bold mt-1">
                      {order.order_number}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(
                        order.created_at
                      ).toLocaleDateString()}
                    </p>

                  </div>


                  <div className="text-right">

                    <strong className="text-lg">
                      ₹
                      {Number(
                        order.total_amount
                      ).toLocaleString("en-IN")}
                    </strong>

                    <div className="mt-2">

                      <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                        {order.order_status}
                      </span>

                    </div>

                  </div>

                </div>


                <div className="flex gap-3 mt-5">

                  <Link
                    to={`/customer/orders/${order.order_id}`}
                    className="customer-button secondary no-underline"
                  >
                    View Details
                  </Link>

                  <Link
                    to={`/customer/orders/${order.order_id}/tracking`}
                    className="customer-button no-underline"
                  >
                    Track Order
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default MyOrders;