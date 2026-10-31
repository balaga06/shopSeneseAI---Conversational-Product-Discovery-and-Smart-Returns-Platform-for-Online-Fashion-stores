import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import "./Support.css";

function QueryDetails() {
  const { id } = useParams();

  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reply, setReply] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuery();
  }, [id]);

  const loadQuery = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/support/queries/${id}`
      );

      setQuery(response.data);
      setReply(response.data?.reply || "");
    } catch (error) {
      console.error("Query details error:", error);
      setQuery(null);
    } finally {
      setLoading(false);
    }
  };

  const generateAIReply = async () => {
    try {
      setAiLoading(true);

      const response = await api.post(
        `/support/queries/${id}/ai-reply`
      );

      setReply(response.data?.suggested_reply || "");
    } catch (error) {
      console.error("AI reply error:", error);

      alert(
        "Unable to generate AI suggested reply."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const submitReply = async () => {
    if (!reply.trim()) {
      alert("Please enter a reply.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post(
        `/support/queries/${id}/reply`,
        {
          reply,
        }
      );

      alert("Reply sent successfully.");

      loadQuery();
    } catch (error) {
      console.error("Reply submission error:", error);

      alert("Failed to send reply.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="support-page">
        <div className="support-loading">
          Loading query...
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="support-page">
        <div className="support-empty">
          <h2>Query not found</h2>

          <Link to="/support/queries">
            Back to Queries
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
            to="/support/queries"
            className="support-back-link"
          >
            ← Back to Queries
          </Link>

          <h1>
            Query #{query.query_id}
          </h1>

          <p>
            Manage customer support request.
          </p>
        </div>

        <span
          className={`support-status ${
            String(query.status || "")
              .toLowerCase()
          }`}
        >
          {query.status || "OPEN"}
        </span>

      </div>

      <div className="support-details-grid">

        <div className="support-detail-card">

          <h2>Customer Information</h2>

          <div className="support-detail-row">
            <span>Name</span>
            <strong>
              {query.customer_name || "-"}
            </strong>
          </div>

          <div className="support-detail-row">
            <span>Email</span>
            <strong>
              {query.customer_email || "-"}
            </strong>
          </div>

          <div className="support-detail-row">
            <span>Phone</span>
            <strong>
              {query.customer_phone || "-"}
            </strong>
          </div>

        </div>

        <div className="support-detail-card">

          <h2>Query Information</h2>

          <div className="support-detail-row">
            <span>Subject</span>
            <strong>
              {query.subject || "-"}
            </strong>
          </div>

          <div className="support-detail-row">
            <span>Order ID</span>
            <strong>
              {query.order_id
                ? `#${query.order_id}`
                : "Not related to order"}
            </strong>
          </div>

          <div className="support-detail-row">
            <span>Created</span>
            <strong>
              {query.created_at
                ? new Date(
                    query.created_at
                  ).toLocaleString()
                : "-"}
            </strong>
          </div>

        </div>

      </div>

      <div className="support-detail-card">

        <h2>Customer Message</h2>

        <div className="support-message">
          {query.message || "No message provided."}
        </div>

      </div>

      <div className="support-detail-card">

        <div className="support-ai-header">

          <div>
            <h2>AI Suggested Reply</h2>

            <p>
              Generate a suggested response using the customer's query
              and available order context.
            </p>
          </div>

          <button
            className="support-ai-btn"
            onClick={generateAIReply}
            disabled={aiLoading}
          >
            {aiLoading
              ? "Generating..."
              : "✨ Generate AI Reply"}
          </button>

        </div>

        <textarea
          className="support-textarea"
          rows="7"
          placeholder="Write your response..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />

        <div className="support-form-actions">

          <button
            className="support-primary-btn"
            onClick={submitReply}
            disabled={submitting}
          >
            {submitting
              ? "Sending..."
              : "Send Reply"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default QueryDetails;