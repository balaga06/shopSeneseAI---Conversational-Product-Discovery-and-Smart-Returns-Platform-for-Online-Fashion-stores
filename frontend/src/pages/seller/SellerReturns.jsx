import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./Seller.css";

function SellerReturns() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReturns();
  }, []);

  const loadReturns = async () => {
    try {
      const response = await api.get("/seller/returns");
      setReturns(response.data || []);
    } catch (error) {
      console.error("Seller returns API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateReturnStatus = async (
    returnId,
    status
  ) => {
    try {
      await api.patch(
        "/seller/returns/" + returnId,
        {
          return_status: status,
        }
      );

      loadReturns();

    } catch (error) {
      console.error(
        "Return status update error:",
        error
      );

      alert(
        error.response?.data?.detail ||
        "Unable to update return."
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="seller-page">

      <aside className="seller-sidebar">

        <Link
          to="/seller/dashboard"
          className="seller-brand"
        >
          <div className="seller-brand-icon">S</div>

          <div>
            <strong>ShopSense</strong>
            <span>AI SELLER</span>
          </div>
        </Link>

        <nav className="seller-navigation">

          <Link
            to="/seller/dashboard"
            className="seller-nav-link"
          >
            <span>⌂</span>
            Dashboard
          </Link>

          <Link
            to="/seller/products"
            className="seller-nav-link"
          >
            <span>▣</span>
            My Products
          </Link>

          <Link
            to="/seller/products/add"
            className="seller-nav-link"
          >
            <span>＋</span>
            Add Product
          </Link>

          <Link
            to="/seller/orders"
            className="seller-nav-link"
          >
            <span>▤</span>
            Orders
          </Link>

          <Link
            to="/seller/returns"
            className="seller-nav-link active"
          >
            <span>↩</span>
            Returns
          </Link>

          <Link
            to="/seller/analytics"
            className="seller-nav-link"
          >
            <span>◉</span>
            Analytics
          </Link>

          <Link
            to="/seller/profile"
            className="seller-nav-link"
          >
            <span>⚙</span>
            Profile
          </Link>

        </nav>

      </aside>


      <main className="seller-main">

        <header className="seller-topbar">

          <span className="seller-topbar-label">
            Seller Workspace
          </span>

          <div className="seller-user-area">

            <div className="seller-avatar">
              {user?.full_name?.charAt(0)?.toUpperCase() || "S"}
            </div>

            <div className="seller-user-details">
              <strong>
                {user?.full_name || "Seller"}
              </strong>

              <span>Seller Account</span>
            </div>

            <button
              className="seller-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </header>


        <div className="seller-content">

          <section className="seller-welcome">

            <div>
              <span className="seller-eyebrow">
                RETURN MANAGEMENT
              </span>

              <h1>
                Product Returns
              </h1>

              <p>
                Review customer returns and their
                reasons.
              </p>
            </div>

          </section>


          <div className="seller-product-table-card">

            <div className="seller-table-header">

              <div>
                <h2>
                  Return Requests
                </h2>

                <span>
                  Review returns related to your products
                </span>
              </div>

            </div>


            {loading ? (

              <div className="seller-empty-state small">
                Loading returns...
              </div>

            ) : returns.length === 0 ? (

              <div className="seller-empty-state small">

                <div className="seller-empty-icon">
                  ↩
                </div>

                <h2>
                  No returns
                </h2>

                <p>
                  Customer return requests will
                  appear here.
                </p>

              </div>

            ) : (

              <div className="seller-table-wrapper">

                <table className="seller-table">

                  <thead>

                    <tr>
                      <th>Return</th>
                      <th>Order</th>
                      <th>Product</th>
                      <th>Reason</th>
                      <th>Requested</th>
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
                          #{item.order_id}
                        </td>

                        <td>
                          {item.product_name || "-"}
                        </td>

                        <td>
                          {item.return_reason || "-"}
                        </td>

                        <td>
                          {item.created_at
                            ? new Date(
                                item.created_at
                              ).toLocaleDateString("en-IN")
                            : "-"}
                        </td>

                        <td>
                          <span className="seller-status pending">
                            {item.return_status ||
                              "REQUESTED"}
                          </span>
                        </td>

                        <td>

                          <select
                            className="seller-inline-select"
                            value={
                              item.return_status ||
                              "REQUESTED"
                            }
                            onChange={(event) =>
                              updateReturnStatus(
                                item.return_id,
                                event.target.value
                              )
                            }
                          >

                            <option value="REQUESTED">
                              Requested
                            </option>

                            <option value="APPROVED">
                              Approved
                            </option>

                            <option value="REJECTED">
                              Rejected
                            </option>

                            <option value="RECEIVED">
                              Received
                            </option>

                            <option value="REFUNDED">
                              Refunded
                            </option>

                          </select>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default SellerReturns;