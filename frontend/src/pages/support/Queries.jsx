import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./Support.css";

function Queries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadQueries();
  }, [status]);

  const loadQueries = async () => {
    try {
      setLoading(true);

      const params = {};

      if (status) {
        params.status = status;
      }

      const response = await api.get("/support/queries", {
        params,
      });

      setQueries(response.data || []);
    } catch (error) {
      console.error("Queries loading error:", error);
      setQueries([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredQueries = queries.filter((query) => {
    const searchText = search.toLowerCase();

    return (
      String(query.query_id || "")
        .toLowerCase()
        .includes(searchText) ||
      String(query.customer_name || "")
        .toLowerCase()
        .includes(searchText) ||
      String(query.subject || "")
        .toLowerCase()
        .includes(searchText) ||
      String(query.message || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  return (
    <div className="support-page">

      <div className="support-header">
        <div>
          <h1>Customer Queries</h1>
          <p>
            Manage customer questions and support requests.
          </p>
        </div>

        <button
          className="support-refresh-btn"
          onClick={loadQueries}
        >
          Refresh
        </button>
      </div>

      <div className="support-filter-card">

        <input
          type="text"
          placeholder="Search customer, subject or query..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="support-input"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="support-select"
        >
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

      </div>

      {loading ? (
        <div className="support-loading">
          Loading customer queries...
        </div>
      ) : filteredQueries.length === 0 ? (
        <div className="support-empty">
          <h3>No customer queries found</h3>
          <p>
            There are currently no support queries matching your filters.
          </p>
        </div>
      ) : (
        <div className="support-table-card">

          <table className="support-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredQueries.map((query) => (

                <tr key={query.query_id}>

                  <td>
                    #{query.query_id}
                  </td>

                  <td>
                    <strong>
                      {query.customer_name || "Customer"}
                    </strong>

                    <small>
                      {query.customer_email || ""}
                    </small>
                  </td>

                  <td>
                    {query.subject || "Customer Support"}
                  </td>

                  <td>
                    <span
                      className={`support-status ${
                        String(query.status || "")
                          .toLowerCase()
                      }`}
                    >
                      {query.status || "OPEN"}
                    </span>
                  </td>

                  <td>
                    {query.created_at
                      ? new Date(
                          query.created_at
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    <Link
                      to={`/support/queries/${query.query_id}`}
                      className="support-view-btn"
                    >
                      View
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

export default Queries;