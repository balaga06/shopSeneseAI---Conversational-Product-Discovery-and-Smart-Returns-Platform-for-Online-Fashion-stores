import { Link, useParams } from "react-router-dom";
import "./Customer.css";

function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <div className="customer-page">

      <div className="customer-container py-20">

        <div className="customer-card max-w-xl mx-auto p-10 text-center">

          <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-4xl mx-auto">
            ✓
          </div>

          <h1 className="text-3xl font-extrabold mt-6">
            Order Placed Successfully
          </h1>

          <p className="text-gray-500 mt-3">
            Thank you for shopping with ShopSense AI.
          </p>

          <p className="text-sm mt-5">
            Order ID:
            <strong className="ml-2">
              {orderId}
            </strong>
          </p>

          <div className="flex gap-3 justify-center mt-8">

            <Link
              to="/customer/orders"
              className="customer-button no-underline"
            >
              View Orders
            </Link>

            <Link
              to="/customer/products"
              className="customer-button secondary no-underline"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default OrderSuccess;