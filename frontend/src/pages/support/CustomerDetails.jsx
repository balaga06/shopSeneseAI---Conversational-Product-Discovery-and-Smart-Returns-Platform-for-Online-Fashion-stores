import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import "./Support.css";

function CustomerDetails() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomer();
  }, [id]);

  const loadCustomer = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/support/customers/${id}`
      );

      setCustomer(response.data);
    } catch (error) {
      console.error(
        "Customer details error:",
        error
      );

      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="support-page">
        <div className="support-loading">
          Loading customer...
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="support-page">

        <div className="support-empty">

          <h2>
            Customer not found
          </h2>

          <Link to="/support/customers">
            Back to Customers
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
            to="/support/customers"
            className="support-back-link"
          >
            ← Back to Customers
          </Link>

          <h1>
            {customer.full_name}
          </h1>

          <p>
            Customer account and support information.
          </p>

        </div>

      </div>

      <div className="support-details-grid">

        <div className="support-detail-card">

          <h2>
            Customer Information
          </h2>

          <div className="support-detail-row">
            <span>Customer ID</span>
            <strong>
              #{customer.user_id}
            </strong>
          </div>

          <div className="support-detail-row">
            <span>Name</span>
            <strong>
              {customer.full_name}
            </strong>
          </div>

          <div className="support-detail-row">
            <span>Email</span>
            <strong>
              {customer.email}
            </strong>
          </div>

          <div className="support-detail-row">
            <span>Phone</span>
            <strong>
              {customer.phone || "-"}
            </strong>
          </div>

          <div className="support-detail-row">
            <span>Status</span>
            <strong>
              {customer.account_status || "ACTIVE"}
            </strong>
          </div>

        </div>

        <div className="support-detail-card">

          <h2>
            Customer Statistics
          </h2>

          <div className="support-mini-stat">
            <span>Total Orders</span>
            <strong>
              {customer.total_orders || 0}
            </strong>
          </div>

          <div className="support-mini-stat">
            <span>Total Returns</span>
            <strong>
              {customer.total_returns || 0}
            </strong>
          </div>

          <div className="support-mini-stat">
            <span>Total Queries</span>
            <strong>
              {customer.total_queries || 0}
            </strong>
          </div>

        </div>

      </div>

      <div className="support-detail-card">

        <h2>
          Recent Orders
        </h2>

        {!customer.orders ||
        customer.orders.length === 0 ? (

          <div className="support-empty-small">
            No orders found.
          </div>

        ) : (

          <div className="support-table-card">

            <table className="support-table">

              <thead>

                <tr>
                  <th>Order ID</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>

              </thead>

              <tbody>

                {customer.orders.map(
                  (order) => (

                    <tr
                      key={order.order_id}
                    >

                      <td>
                        #{order.order_id}
                      </td>

                      <td>
                        ₹
                        {Number(
                          order.total_amount || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      <td>
                        {order.order_status || "-"}
                      </td>

                      <td>
                        {order.created_at
                          ? new Date(
                              order.created_at
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default CustomerDetails;