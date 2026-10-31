import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./Seller.css";

function SellerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [stats, setStats] = useState({
    total_products: 0,
    total_orders: 0,
    total_units_sold: 0,
    total_revenue: 0,
    pending_orders: 0,
    pending_returns: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get("/seller/dashboard");

      setStats({
        total_products: response.data?.total_products || 0,
        total_orders: response.data?.total_orders || 0,
        total_units_sold: response.data?.total_units_sold || 0,
        total_revenue: response.data?.total_revenue || 0,
        pending_orders: response.data?.pending_orders || 0,
        pending_returns: response.data?.pending_returns || 0,
      });
    } catch (error) {
      console.error("Dashboard API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="seller-page">

      {/* SIDEBAR */}
      <aside className="seller-sidebar">

        <Link to="/seller/dashboard" className="seller-brand">
          <div className="seller-brand-icon">S</div>

          <div>
            <strong>ShopSense</strong>
            <span>AI SELLER</span>
          </div>
        </Link>

        <nav className="seller-navigation">

          <Link
            to="/seller/dashboard"
            className="seller-nav-link active"
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

        <div className="seller-ai-box">
          <div className="seller-ai-icon">✦</div>

          <div>
            <strong>ShopSense AI</strong>
            <p>Smart selling insights</p>
          </div>
        </div>

      </aside>


      {/* MAIN */}
      <main className="seller-main">

        {/* TOPBAR */}
        <header className="seller-topbar">

          <div>
            <span className="seller-topbar-label">
              Seller Workspace
            </span>
          </div>

          <div className="seller-user-area">

            <div className="seller-avatar">
              {user?.full_name?.charAt(0)?.toUpperCase() || "S"}
            </div>

            <div className="seller-user-details">
              <strong>
                {user?.full_name || "Seller"}
              </strong>

              <span>
                {user?.email || "Seller account"}
              </span>
            </div>

            <button
              className="seller-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </header>


        {/* CONTENT */}
        <div className="seller-content">

          <section className="seller-welcome">

            <div>
              <span className="seller-eyebrow">
                SHOPSENSE AI · SELLER
              </span>

              <h1>
                Welcome back, {user?.full_name || "Seller"}
              </h1>

              <p>
                Manage your products, orders, inventory
                and sales from one place.
              </p>
            </div>

            <Link
              to="/seller/products/add"
              className="seller-primary-button"
            >
              + Add Product
            </Link>

          </section>


          {/* STATS */}
          <section className="seller-stat-grid">

            <div className="seller-stat-card">
              <div className="seller-stat-icon purple">
                ▣
              </div>

              <div>
                <span>Total Products</span>

                <strong>
                  {loading ? "..." : stats.total_products}
                </strong>
              </div>
            </div>


            <div className="seller-stat-card">
              <div className="seller-stat-icon blue">
                ▤
              </div>

              <div>
                <span>Total Orders</span>

                <strong>
                  {loading ? "..." : stats.total_orders}
                </strong>
              </div>
            </div>


            <div className="seller-stat-card">
              <div className="seller-stat-icon green">
                📦
              </div>

              <div>
                <span>Units Sold</span>

                <strong>
                  {loading ? "..." : stats.total_units_sold}
                </strong>
              </div>
            </div>


            <div className="seller-stat-card">
              <div className="seller-stat-icon orange">
                ₹
              </div>

              <div>
                <span>Total Revenue</span>

                <strong>
                  ₹
                  {loading
                    ? "..."
                    : Number(stats.total_revenue).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

          </section>


          {/* PENDING */}
          <section className="seller-mini-grid">

            <div className="seller-mini-card">
              <div>
                <span>Pending Orders</span>
                <strong>{stats.pending_orders}</strong>
              </div>

              <Link to="/seller/orders">
                View Orders →
              </Link>
            </div>

            <div className="seller-mini-card">
              <div>
                <span>Pending Returns</span>
                <strong>{stats.pending_returns}</strong>
              </div>

              <Link to="/seller/returns">
                View Returns →
              </Link>
            </div>

          </section>


          {/* QUICK ACTIONS */}
          <section className="seller-section">

            <div className="seller-section-heading">
              <div>
                <span>QUICK ACTIONS</span>
                <h2>Manage your store</h2>
              </div>
            </div>


            <div className="seller-action-grid">

              <Link
                to="/seller/products/add"
                className="seller-action-card"
              >
                <div className="seller-action-icon">
                  ＋
                </div>

                <div>
                  <strong>Add Product</strong>
                  <p>
                    Add a new fashion product,
                    price, image and sizes.
                  </p>
                </div>
              </Link>


              <Link
                to="/seller/products"
                className="seller-action-card"
              >
                <div className="seller-action-icon">
                  ▣
                </div>

                <div>
                  <strong>Manage Products</strong>
                  <p>
                    Update price, stock,
                    description and status.
                  </p>
                </div>
              </Link>


              <Link
                to="/seller/orders"
                className="seller-action-card"
              >
                <div className="seller-action-icon">
                  ▤
                </div>

                <div>
                  <strong>Manage Orders</strong>
                  <p>
                    View and update customer
                    orders.
                  </p>
                </div>
              </Link>


              <Link
                to="/seller/analytics"
                className="seller-action-card"
              >
                <div className="seller-action-icon">
                  ◉
                </div>

                <div>
                  <strong>Sales Analytics</strong>
                  <p>
                    Track revenue, orders and
                    product performance.
                  </p>
                </div>
              </Link>

            </div>

          </section>


          {/* AI SECTION */}
          <section className="seller-ai-section">

            <div className="seller-ai-large-icon">
              ✦
            </div>

            <div>
              <span>SHOP SENSE AI</span>

              <h2>
                Intelligent selling insights
              </h2>

              <p>
                ShopSense AI can help identify products
                with high return risk, understand customer
                feedback and highlight products that need
                attention.
              </p>
            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default SellerDashboard;