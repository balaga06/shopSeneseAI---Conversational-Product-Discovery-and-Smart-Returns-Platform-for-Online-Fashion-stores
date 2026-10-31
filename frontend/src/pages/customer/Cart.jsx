import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Customer.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await api.get("/cart");
      setCart(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId, quantity) => {
    if (quantity < 1) return;

    try {
      await api.put(`/cart/${cartId}`, {
        quantity,
      });

      loadCart();
    } catch (error) {
      console.error(error);
    }
  };

  const removeItem = async (cartId) => {
    try {
      await api.delete(`/cart/${cartId}`);
      loadCart();
    } catch (error) {
      console.error(error);
    }
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  if (loading) {
    return (
      <div className="customer-loading">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="customer-page">

      <div className="customer-container py-10">

        <h1 className="customer-title">
          Shopping Cart
        </h1>

        <p className="customer-subtitle">
          Review your selected products.
        </p>


        {cart.length === 0 ? (

          <div className="customer-empty mt-8">

            <div className="text-5xl">
              🛒
            </div>

            <h2 className="text-xl font-bold mt-4">
              Your cart is empty
            </h2>

            <Link
              to="/customer/products"
              className="customer-button inline-block mt-5 no-underline"
            >
              Continue Shopping
            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-7 mt-8">

            <div className="space-y-4">

              {cart.map((item) => (

                <div
                  key={item.cart_id}
                  className="customer-card p-5 flex gap-5"
                >

                  <div className="w-28 h-32 bg-gray-100 rounded-xl overflow-hidden">

                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    )}

                  </div>

                  <div className="flex-1">

                    <h3 className="font-bold text-lg">
                      {item.product_name}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      Size: {item.size_code || "Standard"}
                    </p>

                    <strong className="block mt-3">
                      ₹
                      {Number(
                        item.price
                      ).toLocaleString("en-IN")}
                    </strong>


                    <div className="flex items-center justify-between mt-4">

                      <div className="flex border rounded-lg">

                        <button
                          className="px-3"
                          onClick={() =>
                            updateQuantity(
                              item.cart_id,
                              item.quantity - 1
                            )
                          }
                        >
                          −
                        </button>

                        <span className="px-4 py-2">
                          {item.quantity}
                        </span>

                        <button
                          className="px-3"
                          onClick={() =>
                            updateQuantity(
                              item.cart_id,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>

                      </div>

                      <button
                        className="text-red-600 text-sm font-bold"
                        onClick={() =>
                          removeItem(item.cart_id)
                        }
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>


            <div className="customer-card p-6 h-fit">

              <h2 className="font-bold text-xl">
                Order Summary
              </h2>

              <div className="flex justify-between mt-6">
                <span>Subtotal</span>
                <strong>
                  ₹{subtotal.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="flex justify-between mt-3 text-gray-500">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>

              <hr className="my-5" />

              <div className="flex justify-between text-lg">
                <strong>Total</strong>
                <strong>
                  ₹{subtotal.toLocaleString("en-IN")}
                </strong>
              </div>

              <button
                className="customer-button w-full mt-6"
                onClick={() =>
                  navigate("/customer/checkout")
                }
              >
                Proceed to Checkout
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default Cart;