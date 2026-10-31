import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./Seller.css";

function SellerAnalytics() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [analytics, setAnalytics] = useState({
    total_revenue: 0,
    total_orders: 0,
    total_units: 0,
    average_order_value: 0,
    top_products: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await api.get(
        "/seller/analytics"
      );

      setAnalytics({
        total_revenue:
          response.data?.total_revenue || 0,

        total_orders:
          response.data?.total_orders || 0,

        total_units:
          response.data?.total_units || 0,

        average_order_value:
          response.data?.average_order_value || 0,

        top_products:
          response.data?.top_products || [],
      });

    } catch (error) {
      console.error(
        "Analytics API error:",
        error
      );
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
            className="seller-nav-link"
          >
            <span>↩</span>
            Returns
          </Link>

          <Link
            to="/seller/analytics"
            className="seller-nav-link active"
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
                SELLER INSIGHTS
              </span>

              <h1>
                Sales Analytics
              </h1>

              <p>
                Understand your store performance
                and product sales.
              </p>
            </div>

          </section>


          <section className="seller-stat-grid">

            <div className="seller-stat-card">

              <div className="seller-stat-icon orange">
                ₹
              </div>

              <div>
                <span>Total Revenue</span>

                <strong>
                  {loading
                    ? "..."
                    : "₹" +
                      Number(
                        analytics.total_revenue
                      ).toLocaleString("en-IN")}
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
                  {loading
                    ? "..."
                    : analytics.total_orders}
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
                  {loading
                    ? "..."
                    : analytics.total_units}
                </strong>
              </div>

            </div>


            <div className="seller-stat-card">

              <div className="seller-stat-icon purple">
                ◈
              </div>

              <div>
                <span>Average Order</span>

                <strong>
                  {loading
                    ? "..."
                    : "₹" +
                      Number(
                        analytics.average_order_value
                      ).toLocaleString("en-IN")}
                </strong>
              </div>

            </div>

          </section>


          <section className="seller-product-table-card">

            <div className="seller-table-header">

              <div>
                <h2>
                  Top Products
                </h2>

                <span>
                  Best performing products
                </span>
              </div>

            </div>


            {analytics.top_products.length === 0 ? (

              <div className="seller-empty-state small">

                <div className="seller-empty-icon">
                  ◉
                </div>

                <h2>
                  No sales data yet
                </h2>

                <p>
                  Product performance will appear
                  after customers place orders.
                </p>

              </div>

            ) : (

              <div className="seller-table-wrapper">

                <table className="seller-table">

                  <thead>

                    <tr>
                      <th>Product</th>
                      <th>Units Sold</th>
                      <th>Revenue</th>
                      <th>Rating</th>
                    </tr>

                  </thead>

                  <tbody>

                    {analytics.top_products.map(
                      (product) => (

                        <tr
                          key={product.product_id}
                        >

                          <td>
                            <strong>
                              {product.product_name}
                            </strong>
                          </td>

                          <td>
                            {product.units_sold || 0}
                          </td>

                          <td>
                            ₹
                            {Number(
                              product.revenue || 0
                            ).toLocaleString("en-IN")}
                          </td>

                          <td>
                            <span className="seller-rating">
                              ★
                              {product.average_rating
                                ? Number(
                                    product.average_rating
                                  ).toFixed(1)
                                : "0.0"}
                            </span>
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>


          <section className="seller-ai-section">

            <div className="seller-ai-large-icon">
              ✦
            </div>

            <div>

              <span>AI INSIGHT</span>

              <h2>
                More intelligent seller analytics
              </h2>

              <p>
                Later, ShopSense AI will identify
                products with unusual return rates,
                low stock risk and customer feedback
                patterns.
              </p>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default SellerAnalytics;