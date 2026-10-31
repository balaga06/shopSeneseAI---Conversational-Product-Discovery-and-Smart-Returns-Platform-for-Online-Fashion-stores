import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Customer.css";

function Checkout() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [cart, setCart] = useState([]);

  const [addressId, setAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState("UPI");

  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    loadCheckout();
  }, []);

  const loadCheckout = async () => {
    try {
      const [addressResponse, cartResponse] =
        await Promise.all([
          api.get("/addresses"),
          api.get("/cart"),
        ]);

      setAddresses(addressResponse.data || []);
      setCart(cartResponse.data || []);

      const defaultAddress =
        addressResponse.data?.find(
          (address) => address.is_default
        );

      if (defaultAddress) {
        setAddressId(defaultAddress.address_id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  const placeOrder = async () => {
    if (!addressId) {
      alert("Please select a delivery address.");
      return;
    }

    try {
      setPlacing(true);

      const response = await api.post("/orders", {
        address_id: Number(addressId),
        payment_method: paymentMethod,
      });

      navigate(
        `/customer/order-success/${response.data.order_id}`
      );

    } catch (error) {
      console.error(error);
      alert("Unable to place order.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="customer-loading">
        Loading checkout...
      </div>
    );
  }

  return (
    <div className="customer-page">

      <div className="customer-container py-10">

        <h1 className="customer-title">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-7 mt-8">

          <div className="space-y-6">

            {/* ADDRESS */}

            <div className="customer-card p-6">

              <h2 className="font-bold text-xl mb-5">
                Delivery Address
              </h2>

              <div className="space-y-3">

                {addresses.map((address) => (

                  <label
                    key={address.address_id}
                    className={`block border rounded-xl p-4 cursor-pointer ${
                      Number(addressId) ===
                      address.address_id
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200"
                    }`}
                  >

                    <input
                      type="radio"
                      name="address"
                      value={address.address_id}
                      checked={
                        Number(addressId) ===
                        address.address_id
                      }
                      onChange={(e) =>
                        setAddressId(e.target.value)
                      }
                      className="mr-3"
                    />

                    <strong>
                      {address.full_name}
                    </strong>

                    <p className="text-gray-500 text-sm mt-1">
                      {address.address_line},{" "}
                      {address.city},{" "}
                      {address.state} -{" "}
                      {address.postal_code}
                    </p>

                  </label>

                ))}

              </div>

            </div>


            {/* PAYMENT */}

            <div className="customer-card p-6">

              <h2 className="font-bold text-xl mb-5">
                Payment Method
              </h2>

              <div className="space-y-3">

                {[
                  ["UPI", "UPI"],
                  ["CARD", "Credit / Debit Card"],
                  ["NET_BANKING", "Net Banking"],
                  ["COD", "Cash on Delivery"],
                ].map(([value, label]) => (

                  <label
                    key={value}
                    className="block border rounded-xl p-4 cursor-pointer"
                  >

                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={
                        paymentMethod === value
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                      className="mr-3"
                    />

                    {label}

                  </label>

                ))}

              </div>

            </div>

          </div>


          {/* SUMMARY */}

          <div className="customer-card p-6 h-fit">

            <h2 className="font-bold text-xl">
              Order Summary
            </h2>

            {cart.map((item) => (

              <div
                key={item.cart_id}
                className="flex justify-between mt-4 text-sm"
              >

                <span>
                  {item.product_name} × {item.quantity}
                </span>

                <strong>
                  ₹
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toLocaleString("en-IN")}
                </strong>

              </div>

            ))}

            <hr className="my-5" />

            <div className="flex justify-between text-lg">

              <strong>Total</strong>

              <strong>
                ₹{subtotal.toLocaleString("en-IN")}
              </strong>

            </div>

            <button
              className="customer-button w-full mt-6"
              onClick={placeOrder}
              disabled={placing}
            >
              {placing
                ? "Placing Order..."
                : "Place Order"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;