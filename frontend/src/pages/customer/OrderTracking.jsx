import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import "./Customer.css";

const statuses = [
  "PLACED",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

function OrderTracking() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${orderId}`)
      .then((response) => {
        setOrder(response.data);
      })
      .catch(console.error);
  }, [orderId]);

  if (!order) {
    return (
      <div className="customer-loading">
        Loading tracking...
      </div>
    );
  }

  const currentIndex = statuses.indexOf(
    order.order_status
  );

  return (
    <div className="customer-page">

      <div className="customer-container py-10 max-w-4xl">

        <h1 className="customer-title">
          Track Order
        </h1>

        <p className="customer-subtitle">
          {order.order_number}
        </p>


        <div className="customer-card p-8 mt-8">

          <div className="space-y-7">

            {statuses.map((status, index) => {

              const completed =
                index <= currentIndex;

              return (

                <div
                  key={status}
                  className="flex items-center gap-5"
                >

                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-bold ${
                      completed
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {completed ? "✓" : index + 1}
                  </div>

                  <div>

                    <strong>
                      {status.replaceAll("_", " ")}
                    </strong>

                    {index === currentIndex && (
                      <p className="text-sm text-indigo-600 mt-1">
                        Current status
                      </p>
                    )}

                  </div>

                </div>

              );
            })}

          </div>


          {order.tracking_number && (

            <div className="mt-10 p-4 bg-indigo-50 rounded-xl">

              <span className="text-xs text-indigo-600 font-bold">
                TRACKING NUMBER
              </span>

              <strong className="block mt-1">
                {order.tracking_number}
              </strong>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default OrderTracking;