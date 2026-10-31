import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./Seller.css";

function SellerProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      full_name: user?.full_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      await api.put(
        "/seller/profile",
        {
          full_name: form.full_name,
          phone: form.phone,
        }
      );

      setMessage(
        "Profile updated successfully."
      );

    } catch (error) {

      console.error(
        "Profile update error:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Unable to update profile."
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
            className="seller-nav-link"
          >
            <span>◉</span>
            Analytics
          </Link>

          <Link
            to="/seller/profile"
            className="seller-nav-link active"
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
                SELLER ACCOUNT
              </span>

              <h1>
                My Profile
              </h1>

              <p>
                Manage your seller account information.
              </p>

            </div>

          </section>


          <section className="seller-profile-card">

            <div className="seller-profile-header">

              <div className="seller-large-avatar">
                {user?.full_name?.charAt(0)?.toUpperCase() || "S"}
              </div>

              <div>
                <h2>
                  {user?.full_name || "Seller"}
                </h2>

                <span>
                  SELLER ACCOUNT
                </span>
              </div>

            </div>


            <form
              className="seller-form"
              onSubmit={handleSubmit}
            >

              <div className="seller-form-grid">

                <div className="seller-field">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="seller-field">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    disabled
                  />

                  <small>
                    Email cannot be changed here.
                  </small>

                </div>


                <div className="seller-field">

                  <label>
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                  />

                </div>


                <div className="seller-field">

                  <label>
                    Role
                  </label>

                  <input
                    type="text"
                    value="SELLER"
                    disabled
                  />

                </div>

              </div>


              {error && (
                <div className="seller-error">
                  {error}
                </div>
              )}


              {message && (
                <div className="seller-success">
                  ✓ {message}
                </div>
              )}


              <div className="seller-form-actions">

                <button
                  type="submit"
                  className="seller-primary-button"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </section>

        </div>

      </main>

    </div>
  );
}

export default SellerProfile;