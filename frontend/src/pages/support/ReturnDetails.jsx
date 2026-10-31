import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import "./Support.css";

function ReturnDetails() {
  const { id } = useParams();

  const [returnData, setReturnData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadReturn();
  }, [id]);

  const loadReturn = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/support/returns/${id}`
      );

      setReturnData(response.data);
    } catch (error) {
      console.error("Return details error:", error);
      setReturnData(null);
    } finally {
      setLoading(false);
    }
  };

  const updateReturn = async (status) => {
    try {
      setProcessing(true);

      await api.put(
        `/support/returns/${id}`,
        {
          status,
        }
      );

      alert(
        `Return ${status.toLowerCase()} successfully.`
      );

      loadReturn();
    } catch (error) {
      console.error("Return update error:", error);

      alert("Unable to update return.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="support-page">
        <div className="support-loading">
          Loading return...
        </div>
      </div>
    );
  }

  if (!returnData) {
    return (
      <div className="support-page">

        <div className="support-empty">

          <h2>
            Return request not found
          </h2>

          <Link to="/support/returns">
            Back to Returns
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="support-page">

      <div className="support-header">

        <div>

          <Link
            to="/support/returns"
            className="support-back-link"
          >
            ← Back to Returns
          </Link>

          <h1>
            Return #{returnData.return_id}
          </h1>

          <p>
            Review return request and AI risk assessment.
          </p>

        </div>

        <span
          className={`support-status ${
            String(returnData.status || "")
              .toLowerCase()
          }`}
        >
          {returnData.status || "PENDING"}
        </span>

      </div>

      <div className="support-details-grid">

        <div className="support-detail-card">

          <h2>Customer</h2>

          <div className="support-detail-row">
            <span>Name</span>
            <strong>
              {returnData.customer_name || "-"}
            </strong>
          </div>

          <div className="support-detail-row">
            <span>Email</span>
            <strong>
              {returnData.customer_email || "-"}
            </strong>
          </div>

        </div>

        <div className="support-detail-card">

          <h2>Order</h2>

          <div className="support-detail-row">
            <span>Order ID</span>
            <strong>
              {returnData.order_id
                ? `#${returnData.order_id}`
                : "-"}
            </strong>
          </div>

          <div className="support-detail-row">
            <span>Product</span>
            <strong>
              {returnData.product_name || "-"}
            </strong>
          </div>

          <div className="support-detail-row">
            <span>Selected Size</span>
            <strong>
              {returnData.size_code || "-"}
            </strong>
          </div>

        </div>

      </div>

      <div className="support-detail-card">

        <h2>Return Reason</h2>

        <div className="support-message">
          {returnData.return_reason || "No reason provided."}
        </div>

      </div>

      <div className="support-ai-risk-card">

        <div>

          <h2>
            🤖 AI Return Risk
          </h2>

          <p>
            AI prediction helps the support agent review potentially
            risky return requests.
          </p>

        </div>

        <div
          className={`risk-large ${
            String(
              returnData.risk_level || "LOW"
            ).toLowerCase()
          }`}
        >
          {returnData.risk_level || "LOW"}

          {returnData.risk_probability !== undefined && (
            <small>
              {(
                Number(
                  returnData.risk_probability
                ) * 100
              ).toFixed(1)}
              %
            </small>
          )}
        </div>

      </div>

      {String(returnData.status).toUpperCase() === "PENDING" && (

        <div className="support-detail-card">

          <h2>
            Return Decision
          </h2>

          <div className="support-form-actions">

            <button
              className="support-approve-btn"
              disabled={processing}
              onClick={() =>
                updateReturn("APPROVED")
              }
            >
              Approve Return
            </button>

            <button
              className="support-reject-btn"
              disabled={processing}
              onClick={() =>
                updateReturn("REJECTED")
              }
            >
              Reject Return
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default ReturnDetails;