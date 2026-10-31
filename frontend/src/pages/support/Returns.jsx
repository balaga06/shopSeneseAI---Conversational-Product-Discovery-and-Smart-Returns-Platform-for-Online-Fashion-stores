import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./Support.css";

function Returns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");

  useEffect(() => {
    loadReturns();
  }, [status]);

  const loadReturns = async () => {
    try {
      setLoading(true);

      const params = {};

      if (status) {
        params.status = status;
      }

      const response = await api.get(
        "/support/returns",
        {
          params,
        }
      );

      setReturns(response.data || []);
    } catch (error) {
      console.error("Returns loading error:", error);
      setReturns([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-page">

      <div className="support-header">

        <div>
          <h1>Return Requests</h1>

          <p>
            Review customer return requests and risk predictions.
          </p>
        </div>

        <button
          className="support-refresh-btn"
          onClick={loadReturns}
        >
          Refresh
        </button>

      </div>

      <div className="support-filter-card">

        <select
          className="support-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">
            All Return Status
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="APPROVED">
            Approved
          </option>

          <option value="REJECTED">
            Rejected
          </option>

          <option value="COMPLETED">
            Completed
          </option>
        </select>

      </div>

      {loading ? (
        <div className="support-loading">
          Loading returns...
        </div>
      ) : returns.length === 0 ? (
        <div className="support-empty">
          <h3>No return requests found</h3>
          <p>
            There are no return requests matching the selected status.
          </p>
        </div>
      ) : (
        <div className="support-table-card">

          <table className="support-table">

            <thead>

              <tr>
                <th>Return ID</th>
                <th>Customer</th>
                <th>Order</th>
                <th>Reason</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {returns.map((item) => (

                <tr key={item.return_id}>

                  <td>
                    #{item.return_id}
                  </td>

                  <td>
                    <strong>
                      {item.customer_name || "Customer"}
                    </strong>
                  </td>

                  <td>
                    {item.order_id
                      ? `#${item.order_id}`
                      : "-"}
                  </td>

                  <td>
                    {item.return_reason || "-"}
                  </td>

                  <td>

                    <span
                      className={`risk-badge ${
                        String(
                          item.risk_level || "LOW"
                        ).toLowerCase()
                      }`}
                    >
                      {item.risk_level || "LOW"}
                    </span>

                  </td>

                  <td>

                    <span
                      className={`support-status ${
                        String(item.status || "")
                          .toLowerCase()
                      }`}
                    >
                      {item.status || "PENDING"}
                    </span>

                  </td>

                  <td>

                    <Link
                      to={`/support/returns/${item.return_id}`}
                      className="support-view-btn"
                    >
                      Review
                    </Link>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default Returns;