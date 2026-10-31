import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./Support.css";

function Dashboard() {
  const [stats, setStats] = useState({
    total_queries: 0,
    pending_queries: 0,
    resolved_queries: 0,
    pending_returns: 0,
    high_risk_orders: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get("/support/dashboard");

      setStats({
        total_queries: response.data?.total_queries || 0,
        pending_queries: response.data?.pending_queries || 0,
        resolved_queries: response.data?.resolved_queries || 0,
        pending_returns: response.data?.pending_returns || 0,
        high_risk_orders: response.data?.high_risk_orders || 0,
      });
    } catch (error) {
      console.error("Support dashboard error:", error);

      // Keep dashboard usable if backend endpoint is not ready
      setStats({
        total_queries: 0,
        pending_queries: 0,
        resolved_queries: 0,
        pending_returns: 0,
        high_risk_orders: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-page">

      <div className="support-header">
        <div>
          <h1>Support Dashboard</h1>
          <p>
            Manage customer queries, returns and AI-assisted support.
          </p>
        </div>

        <button
          className="support-refresh-btn"
          onClick={loadDashboard}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="support-loading">
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="support-stats-grid">

            <div className="support-stat-card">
              <span>Total Queries</span>
              <strong>{stats.total_queries}</strong>
            </div>

            <div className="support-stat-card pending">
              <span>Pending Queries</span>
              <strong>{stats.pending_queries}</strong>
            </div>

            <div className="support-stat-card success">
              <span>Resolved Queries</span>
              <strong>{stats.resolved_queries}</strong>
            </div>

            <div className="support-stat-card warning">
              <span>Pending Returns</span>
              <strong>{stats.pending_returns}</strong>
            </div>

            <div className="support-stat-card danger">
              <span>High Risk Orders</span>
              <strong>{stats.high_risk_orders}</strong>
            </div>

          </div>

          <div className="support-dashboard-grid">

            <Link
              to="/support/queries"
              className="support-action-card"
            >
              <div className="support-action-icon">
                💬
              </div>

              <h3>Customer Queries</h3>

              <p>
                View customer questions and provide AI-assisted responses.
              </p>
            </Link>

            <Link
              to="/support/returns"
              className="support-action-card"
            >
              <div className="support-action-icon">
                ↩️
              </div>

              <h3>Return Requests</h3>

              <p>
                Review customer returns and AI return-risk predictions.
              </p>
            </Link>

            <Link
              to="/support/customers"
              className="support-action-card"
            >
              <div className="support-action-icon">
                👥
              </div>

              <h3>Customers</h3>

              <p>
                Search customers and view their order and support history.
              </p>
            </Link>

          </div>
        </>
      )}

    </div>
  );
}

export default Dashboard;