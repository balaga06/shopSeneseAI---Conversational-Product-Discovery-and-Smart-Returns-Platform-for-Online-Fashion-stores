import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import "./Customer.css";

function OrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const response = await api.get(
        `/orders/${orderId}`
      );

      setOrder(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="customer-loading">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="customer-empty">
        Order not found.
      </div>
    );
  }

  return (
    <div className="customer-page">

      <div className="customer-container py-10">

        <h1 className="customer-title">
          Order Details
        </h1>

        <p className="customer-subtitle">
          {order.order_number}
        </p>


        <div className="customer-card p-6 mt-8">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

            <div>
              <span className="text-xs text-gray-500">
                ORDER STATUS
              </span>

              <strong className="block mt-1">
                {order.order_status}
              </strong>
            </div>

            <div>
              <span className="text-xs text-gray-500">
                PAYMENT
              </span>

              <strong className="block mt-1">
                {order.payment_status}
              </strong>
            </div>

            <div>
              <span className="text-xs text-gray-500">
                TOTAL
              </span>

              <strong className="block mt-1">
                ₹
                {Number(
                  order.total_amount
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span className="text-xs text-gray-500">
                TRACKING
              </span>

              <strong className="block mt-1">
                {order.tracking_number || "Not available"}
              </strong>
            </div>

          </div>

        </div>


        <div className="customer-card p-6 mt-6">

          <h2 className="text-xl font-bold">
            Items
          </h2>

          <div className="mt-5 space-y-4">

            {(order.items || []).map((item) => (

              <div
                key={item.order_item_id}
                className="flex justify-between border-b pb-4"
              >

                <div>
                  <strong>
                    {item.product_name}
                  </strong>

                  <p className="text-sm text-gray-500">
                    Size: {item.size_code || "Standard"}
                    {" · "}
                    Quantity: {item.quantity}
                  </p>
                </div>

                <strong>
                  ₹
                  {Number(
                    item.total_price
                  ).toLocaleString("en-IN")}
                </strong>

              </div>

            ))}

          </div>

        </div>


        <div className="flex gap-3 mt-6">

          <Link
            to={`/customer/orders/${orderId}/tracking`}
            className="customer-button no-underline"
          >
            Track Order
          </Link>

          <Link
            to="/customer/orders"
            className="customer-button secondary no-underline"
          >
            Back to Orders
          </Link>

        </div>

      </div>

    </div>
  );
}

export default OrderDetails;