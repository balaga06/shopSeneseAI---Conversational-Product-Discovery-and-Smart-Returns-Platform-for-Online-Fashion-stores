import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./Seller.css";

function SellerOrders() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await api.get("/seller/orders");
      setOrders(response.data || []);
    } catch (error) {
      console.error("Seller orders API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.patch(
        "/seller/orders/" + orderId,
        {
          order_status: status,
        }
      );

      loadOrders();

    } catch (error) {
      console.error(
        "Order status update error:",
        error
      );

      alert(
        error.response?.data?.detail ||
        "Unable to update order."
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
            className="seller-nav-link active"
          >
            <span>▤</span>
            Orders
          </Link>

          <Link
            to="/seller/returns"
            className="seller-nav-link"
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
                ORDER MANAGEMENT
              </span>

              <h1>
                Customer Orders
              </h1>

              <p>
                Manage orders containing your products.
              </p>
            </div>

          </section>


          <div className="seller-product-table-card">

            <div className="seller-table-header">

              <div>
                <h2>
                  Orders
                </h2>

                <span>
                  Track and manage fulfilment
                </span>
              </div>

            </div>


            {loading ? (

              <div className="seller-empty-state small">
                Loading orders...
              </div>

            ) : orders.length === 0 ? (

              <div className="seller-empty-state small">

                <div className="seller-empty-icon">
                  🛒
                </div>

                <h2>
                  No orders yet
                </h2>

                <p>
                  Orders containing your products
                  will appear here.
                </p>

              </div>

            ) : (

              <div className="seller-table-wrapper">

                <table className="seller-table">

                  <thead>

                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Update</th>
                    </tr>

                  </thead>

                  <tbody>

                    {orders.map((order) => (

                      <tr key={order.order_item_id || order.order_id}>

                        <td>
                          #{order.order_id}
                        </td>

                        <td>
                          {order.customer_name || "-"}
                        </td>

                        <td>
                          <strong>
                            {order.product_name || "-"}
                          </strong>
                        </td>

                        <td>
                          {order.quantity || 0}
                        </td>

                        <td>
                          ₹
                          {Number(
                            order.item_total ||
                            order.total_amount ||
                            0
                          ).toLocaleString("en-IN")}
                        </td>

                        <td>
                          <span className="seller-status active">
                            {order.order_status || "PENDING"}
                          </span>
                        </td>

                        <td>

                          <select
                            className="seller-inline-select"
                            value={
                              order.order_status ||
                              "PENDING"
                            }
                            onChange={(event) =>
                              updateOrderStatus(
                                order.order_id,
                                event.target.value
                              )
                            }
                          >
                            <option value="PENDING">
                              Pending
                            </option>

                            <option value="CONFIRMED">
                              Confirmed
                            </option>

                            <option value="PROCESSING">
                              Processing
                            </option>

                            <option value="SHIPPED">
                              Shipped
                            </option>

                            <option value="DELIVERED">
                              Delivered
                            </option>

                            <option value="CANCELLED">
                              Cancelled
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

export default SellerOrders;