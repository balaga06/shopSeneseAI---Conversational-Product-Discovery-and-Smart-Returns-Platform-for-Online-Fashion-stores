import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./Customer.css";

function ReturnRequest() {
  const { orderItemId } = useParams();
  const navigate = useNavigate();

  const [reason, setReason] = useState("WRONG_SIZE");
  const [description, setDescription] = useState("");

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/order-items/${orderItemId}`)
      .then((response) => {
        setItem(response.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderItemId]);

  const submitReturn = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await api.post("/returns", {
        order_item_id: Number(orderItemId),
        reason,
        description,
      });

      navigate("/customer/returns");

    } catch (error) {
      console.error(error);
      alert("Unable to submit return request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="customer-loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="customer-page">

      <div className="customer-container py-10 max-w-3xl">

        <h1 className="customer-title">
          Request a Return
        </h1>

        <p className="customer-subtitle">
          Tell us why you want to return this product.
        </p>


        {item && (

          <div className="customer-card p-5 mt-7">

            <strong>
              {item.product_name}
            </strong>

            <p className="text-gray-500 text-sm mt-1">
              Quantity: {item.quantity}
            </p>

          </div>

        )}


        <form
          onSubmit={submitReturn}
          className="customer-card p-6 mt-5"
        >

          <label className="block font-bold mb-2">
            Return Reason
          </label>

          <select
            className="customer-select"
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
          >
            <option value="WRONG_SIZE">
              Wrong Size
            </option>

            <option value="FIT_ISSUE">
              Fit Issue
            </option>

            <option value="DAMAGED">
              Damaged
            </option>

            <option value="QUALITY_ISSUE">
              Quality Issue
            </option>

            <option value="WRONG_PRODUCT">
              Wrong Product
            </option>

            <option value="CHANGED_MIND">
              Changed Mind
            </option>

            <option value="OTHER">
              Other
            </option>

          </select>


          <label className="block font-bold mt-6 mb-2">
            Additional Details
          </label>

          <textarea
            className="customer-textarea"
            placeholder="Explain the issue..."
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />


          <button
            className="customer-button mt-6"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit Return Request"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default ReturnRequest;