import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./Seller.css";

function SellerProducts() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get("/seller/products");
      setProducts(response.data || []);
    } catch (error) {
      console.error("Products API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(
        "/seller/products/" + productId
      );

      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) =>
            product.product_id !== productId
        )
      );

    } catch (error) {
      console.error("Delete product error:", error);

      alert(
        error.response?.data?.detail ||
        "Unable to delete product."
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
            className="seller-nav-link active"
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
                PRODUCT CATALOGUE
              </span>

              <h1>
                My Products
              </h1>

              <p>
                Manage products that belong to your
                ShopSense seller account.
              </p>
            </div>

            <Link
              to="/seller/products/add"
              className="seller-primary-button"
            >
              + Add Product
            </Link>

          </section>


          {loading ? (

            <div className="seller-empty-state">
              <div className="seller-loading-spinner">
                ⟳
              </div>

              <h2>
                Loading products...
              </h2>
            </div>

          ) : products.length === 0 ? (

            <div className="seller-empty-state">

              <div className="seller-empty-icon">
                📦
              </div>

              <h2>
                No products yet
              </h2>

              <p>
                Add your first product to start
                selling on ShopSense AI.
              </p>

              <Link
                to="/seller/products/add"
                className="seller-primary-button"
              >
                Add Your First Product
              </Link>

            </div>

          ) : (

            <div className="seller-product-table-card">

              <div className="seller-table-header">

                <div>
                  <h2>
                    Product Catalogue
                  </h2>

                  <span>
                    {products.length} product
                    {products.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <Link
                  to="/seller/products/add"
                  className="seller-small-button"
                >
                  + Add Product
                </Link>

              </div>


              <div className="seller-table-wrapper">

                <table className="seller-table">

                  <thead>

                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>

                  </thead>

                  <tbody>

                    {products.map((product) => {

                      const displayPrice =
                        product.discount_price ??
                        product.price;

                      return (
                        <tr key={product.product_id}>

                          <td>

                            <div className="seller-product-cell">

                              {product.image_url ? (

                                <img
                                  src={product.image_url}
                                  alt={product.product_name}
                                  className="seller-product-image"
                                />

                              ) : (

                                <div className="seller-product-placeholder">
                                  ✦
                                </div>

                              )}

                              <div>
                                <strong>
                                  {product.product_name}
                                </strong>

                                <span>
                                  {product.brand || "ShopSense"}
                                </span>
                              </div>

                            </div>

                          </td>


                          <td>
                            {product.category_name || "-"}
                          </td>


                          <td>

                            <strong>
                              ₹
                              {Number(
                                displayPrice || 0
                              ).toLocaleString("en-IN")}
                            </strong>

                            {product.discount_price &&
                              Number(product.discount_price) <
                                Number(product.price) && (
                                <del className="seller-old-price">
                                  ₹
                                  {Number(
                                    product.price
                                  ).toLocaleString("en-IN")}
                                </del>
                              )}

                          </td>


                          <td>
                            {product.stock ?? 0}
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


                          <td>

                            <span
                              className={
                                "seller-status " +
                                String(
                                  product.product_status ||
                                  "ACTIVE"
                                ).toLowerCase()
                              }
                            >
                              {product.product_status ||
                                "ACTIVE"}
                            </span>

                          </td>


                          <td>

                            <div className="seller-table-actions">

                              <Link
                                to={
                                  "/seller/products/edit/" +
                                  product.product_id
                                }
                              >
                                Edit
                              </Link>

                              <button
                                onClick={() =>
                                  deleteProduct(
                                    product.product_id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default SellerProducts;