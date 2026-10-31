import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./Home.css";

const API_URL = "http://localhost:8000/api";

function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);

      const categoryResponse = await axios.get(
        API_URL + "/categories"
      );

      const productResponse = await axios.get(
        API_URL + "/products"
      );

      setCategories(categoryResponse.data || []);
      setProducts(productResponse.data || []);
    } catch (error) {
      console.error("Unable to load home data:", error);

      setCategories([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchText.trim();

    if (!query) {
      return;
    }

    navigate(
      "/customer/ai-search?q=" + encodeURIComponent(query)
    );
  };

  const openCategory = (categoryId) => {
    navigate(
      "/customer/products?category=" + categoryId
    );
  };

  const openProduct = (productId) => {
    navigate("/customer/product/" + productId);
  };

  const getProductPrice = (product) => {
    if (
      product.discount_price !== null &&
      product.discount_price !== undefined
    ) {
      return product.discount_price;
    }

    return product.price;
  };

  const getDiscount = (product) => {
    if (
      product.discount_price &&
      product.price &&
      Number(product.discount_price) < Number(product.price)
    ) {
      return Math.round(
        ((Number(product.price) -
          Number(product.discount_price)) /
          Number(product.price)) *
          100
      );
    }

    return 0;
  };

  const getCategoryIcon = (categoryName) => {
    const name = String(categoryName || "").toLowerCase();

    if (name.includes("shirt")) {
      return "👕";
    }

    if (name.includes("dress")) {
      return "👗";
    }

    if (name.includes("shoe")) {
      return "👟";
    }

    if (name.includes("jean")) {
      return "👖";
    }

    if (name.includes("men")) {
      return "👔";
    }

    if (name.includes("women")) {
      return "👗";
    }

    if (name.includes("accessor")) {
      return "👜";
    }

    if (name.includes("sport")) {
      return "⚽";
    }

    return "✦";
  };

  return (
    <div className="shopsense-home">

      {/* TOP STRIP */}
      <div className="top-strip">
        <div className="home-container top-strip-content">

          <div>
            <span className="top-highlight">
              ShopSense AI
            </span>

            <span> | </span>

            <span>
              AI-powered fashion shopping
            </span>
          </div>

          <div className="top-links">
            <span>Help Center</span>
            <span>Track Order</span>
            <span>Become a Seller</span>
          </div>

        </div>
      </div>


      {/* NAVBAR */}
      <header className="main-navbar">

        <div className="home-container navbar-content">

          {/* LOGO */}
          <Link
            to="/customer/home"
            className="brand"
          >

            <div className="brand-icon">
              S
            </div>

            <div className="brand-text">

              <span className="brand-name">
                ShopSense
              </span>

              <span className="brand-ai">
                AI
              </span>

            </div>

          </Link>


          {/* SEARCH */}
          <form
            className="ai-search-bar"
            onSubmit={handleSearch}
          >

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Ask AI what you're looking for..."
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
            />

            <span className="ai-search-label">
              ✦ AI Search
            </span>

            <button type="submit">
              Search
            </button>

          </form>


          {/* NAVIGATION */}
          <div className="navbar-actions">

            <Link
              to="/customer/wishlist"
              className="nav-action"
            >
              <span>♡</span>
              <small>Wishlist</small>
            </Link>


            <Link
              to="/customer/cart"
              className="nav-action"
            >
              <span>🛒</span>
              <small>Cart</small>
            </Link>


            <Link
              to="/customer/profile"
              className="profile-action"
            >

              <div className="profile-avatar">
                👤
              </div>

              <div>

                <span>
                  Hello,
                </span>

                <strong>
                  {user?.full_name || "Account"}
                </strong>

              </div>

            </Link>


            <button
              type="button"
              onClick={handleLogout}
              className="nav-action"
            >
              <span>↪</span>
              <small>Logout</small>
            </button>

          </div>

        </div>

      </header>


      {/* CATEGORY NAVIGATION */}
      <section className="category-navigation">

        <div className="home-container category-scroll">

          <Link
            to="/customer/home"
            className="category-nav-item active"
          >

            <div className="category-nav-icon">
              ✦
            </div>

            <span>
              For You
            </span>

          </Link>


          {categories.map((category) => (

            <button
              key={category.category_id}
              type="button"
              className="category-nav-item"
              onClick={() =>
                openCategory(category.category_id)
              }
            >

              <div className="category-nav-icon">

                {getCategoryIcon(
                  category.category_name
                )}

              </div>

              <span>
                {category.category_name}
              </span>

            </button>

          ))}

        </div>

      </section>


      {/* MAIN */}
      <main>


        {/* HERO */}
        <section className="hero-section">

          <div className="home-container hero-grid">

            <div className="hero-content">

              <div className="hero-badge">
                ✦ AI-POWERED SHOPPING
              </div>

              <h1>

                Find what you want.

                <br />

                <span>
                  Let AI find it better.
                </span>

              </h1>

              <p>
                Discover fashion based on your style,
                size, budget and preferences — not just
                keywords.
              </p>


              <form
                className="hero-search"
                onSubmit={handleSearch}
              >

                <span>
                  ✦
                </span>

                <input
                  type="text"
                  placeholder='Try "relaxed party outfit under ₹2000"'
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(event.target.value)
                  }
                />

                <button type="submit">
                  Ask AI
                </button>

              </form>


              <div className="hero-features">

                <div>
                  <span>✓</span>
                  Smart Size
                </div>

                <div>
                  <span>✓</span>
                  Personalized Picks
                </div>

                <div>
                  <span>✓</span>
                  Review Insights
                </div>

              </div>

            </div>


            {/* HERO VISUAL */}
            <div className="hero-visual">

              <div className="hero-card hero-card-main">

                <div className="hero-fashion-icon">
                  ✦
                </div>

                <span>
                  SHOP SMARTER
                </span>

                <h3>

                  Your style.

                  <br />

                  Your size.

                  <br />

                  Your recommendations.

                </h3>

              </div>


              <div className="floating-ai-card">

                <div className="floating-ai-icon">
                  ✦
                </div>

                <div>

                  <strong>
                    AI Recommendation
                  </strong>

                  <p>
                    Personalized for you
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* AI FEATURES */}
        <section className="ai-features-section">

          <div className="home-container">

            <div className="section-heading centered">

              <span className="section-eyebrow">
                SMART SHOPPING
              </span>

              <h2>
                Shopping that understands you
              </h2>

              <p>
                ShopSense AI helps you make better
                decisions before you buy.
              </p>

            </div>


            <div className="ai-feature-grid">

              <Link
                to="/customer/ai-search"
                className="ai-feature-card"
              >

                <div className="feature-icon purple">
                  ✦
                </div>

                <div>

                  <h3>
                    AI Product Search
                  </h3>

                  <p>
                    Describe what you want naturally
                    and let AI find matching products.
                  </p>

                  <span>
                    Try AI Search →
                  </span>

                </div>

              </Link>


              <Link
                to="/customer/profile"
                className="ai-feature-card"
              >

                <div className="feature-icon teal">
                  ◇
                </div>

                <div>

                  <h3>
                    Smart Size Recommendation
                  </h3>

                  <p>
                    Get a size recommendation using
                    your measurements and product
                    size chart.
                  </p>

                  <span>
                    Find My Size →
                  </span>

                </div>

              </Link>


              <Link
                to="/customer/products"
                className="ai-feature-card"
              >

                <div className="feature-icon orange">
                  ★
                </div>

                <div>

                  <h3>
                    Personalized Products
                  </h3>

                  <p>
                    Discover products selected according
                    to your preferences and activity.
                  </p>

                  <span>
                    Explore Picks →
                  </span>

                </div>

              </Link>

            </div>

          </div>

        </section>


        {/* CATEGORIES */}
        {categories.length > 0 && (

          <section className="home-section">

            <div className="home-container">

              <div className="section-heading">

                <div>

                  <span className="section-eyebrow">
                    EXPLORE
                  </span>

                  <h2>
                    Shop by category
                  </h2>

                </div>

                <Link to="/customer/products">
                  View all →
                </Link>

              </div>


              <div className="category-grid">

                {categories
                  .slice(0, 8)
                  .map((category) => (

                    <button
                      key={category.category_id}
                      type="button"
                      className="category-card"
                      onClick={() =>
                        openCategory(
                          category.category_id
                        )
                      }
                    >

                      <div className="category-large-icon">

                        {getCategoryIcon(
                          category.category_name
                        )}

                      </div>

                      <h3>
                        {category.category_name}
                      </h3>

                      <span>
                        Explore collection →
                      </span>

                    </button>

                  ))}

              </div>

            </div>

          </section>

        )}


        {/* PRODUCTS */}
        <section className="home-section products-section">

          <div className="home-container">

            <div className="section-heading">

              <div>

                <span className="section-eyebrow">
                  DISCOVER
                </span>

                <h2>
                  {products.length > 0
                    ? "Trending for you"
                    : "Products will appear here"}
                </h2>

              </div>

              <Link to="/customer/products">
                View all →
              </Link>

            </div>


            {/* LOADING */}
            {loading && (

              <div className="product-grid">

                {[1, 2, 3, 4].map((item) => (

                  <div
                    className="product-skeleton"
                    key={item}
                  />

                ))}

              </div>

            )}


            {/* PRODUCTS */}
            {!loading && products.length > 0 && (

              <div className="product-grid">

                {products
                  .slice(0, 8)
                  .map((product) => {

                    const discount =
                      getDiscount(product);

                    return (

                      <article
                        className="product-card"
                        key={product.product_id}
                        onClick={() =>
                          openProduct(
                            product.product_id
                          )
                        }
                      >

                        <div className="product-image">

                          {product.image_url ? (

                            <img
                              src={product.image_url}
                              alt={
                                product.product_name
                              }
                            />

                          ) : (

                            <div className="product-image-placeholder">

                              <span>
                                ✦
                              </span>

                            </div>

                          )}


                          {discount > 0 && (

                            <span className="discount-badge">
                              {discount}% OFF
                            </span>

                          )}


                          <button
                            type="button"
                            className="wishlist-button"
                            onClick={(event) =>
                              event.stopPropagation()
                            }
                          >
                            ♡
                          </button>

                        </div>


                        <div className="product-info">

                          <span className="product-brand">
                            {product.brand ||
                              "ShopSense"}
                          </span>


                          <h3>
                            {product.product_name}
                          </h3>


                          <p className="product-description">

                            {product.description
                              ? product.description.slice(
                                  0,
                                  70
                                )
                              : "Discover this product on ShopSense AI."}

                          </p>


                          <div className="product-price">

                            <strong>

                              ₹
                              {Number(
                                getProductPrice(product)
                              ).toLocaleString("en-IN")}

                            </strong>


                            {discount > 0 && (

                              <del>

                                ₹
                                {Number(
                                  product.price
                                ).toLocaleString("en-IN")}

                              </del>

                            )}

                          </div>


                          <div className="product-meta">

                            <span>
                              {product.fit_type ||
                                "Regular"}{" "}
                              Fit
                            </span>

                            <span>
                              {product.color ||
                                "Multiple colors"}
                            </span>

                          </div>

                        </div>

                      </article>

                    );

                  })}

              </div>

            )}


            {/* EMPTY */}
            {!loading && products.length === 0 && (

              <div className="empty-products">

                <div>
                  ✦
                </div>

                <h3>
                  Your catalogue is waiting
                </h3>

                <p>
                  Products added by sellers will
                  automatically appear here.
                </p>

                <Link to="/customer/products">
                  Browse Products
                </Link>

              </div>

            )}

          </div>

        </section>


        {/* HOW IT WORKS */}
        <section className="how-section">

          <div className="home-container">

            <div className="section-heading centered">

              <span className="section-eyebrow">
                HOW IT WORKS
              </span>

              <h2>
                From discovery to delivery
              </h2>

              <p>
                One intelligent shopping experience.
              </p>

            </div>


            <div className="steps-grid">

              <div className="step-card">

                <span className="step-number">
                  01
                </span>

                <div className="step-icon">
                  ✦
                </div>

                <h3>
                  Tell us what you want
                </h3>

                <p>
                  Search naturally using AI instead
                  of complicated filters.
                </p>

              </div>


              <div className="step-card">

                <span className="step-number">
                  02
                </span>

                <div className="step-icon">
                  ◇
                </div>

                <h3>
                  Get the right size
                </h3>

                <p>
                  AI analyzes your measurements
                  and the product size chart.
                </p>

              </div>


              <div className="step-card">

                <span className="step-number">
                  03
                </span>

                <div className="step-icon">
                  ★
                </div>

                <h3>
                  Buy with confidence
                </h3>

                <p>
                  Understand reviews and choose
                  products personalized for you.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* TRUST */}
        <section className="trust-section">

          <div className="home-container trust-grid">

            <div>
              <strong>
                15K+
              </strong>

              <span>
                Products
              </span>
            </div>


            <div>
              <strong>
                AI
              </strong>

              <span>
                Smart Recommendations
              </span>
            </div>


            <div>
              <strong>
                ✓
              </strong>

              <span>
                Secure Shopping
              </span>
            </div>


            <div>
              <strong>
                ↻
              </strong>

              <span>
                Easy Returns
              </span>
            </div>

          </div>

        </section>

      </main>


      {/* FOOTER */}
      <footer className="home-footer">

        <div className="home-container footer-grid">


          <div className="footer-brand">

            <div className="brand footer-brand-logo">

              <div className="brand-icon">
                S
              </div>

              <div className="brand-text">

                <span className="brand-name">
                  ShopSense
                </span>

                <span className="brand-ai">
                  AI
                </span>

              </div>

            </div>

            <p>
              AI-powered product discovery
              for smarter fashion shopping.
            </p>

          </div>


          <div className="footer-column">

            <h4>
              Shop
            </h4>

            <Link to="/customer/products">
              All Products
            </Link>

            <Link to="/customer/wishlist">
              Wishlist
            </Link>

            <Link to="/customer/cart">
              Cart
            </Link>

            <Link to="/customer/orders">
              My Orders
            </Link>

          </div>


          <div className="footer-column">

            <h4>
              AI Features
            </h4>

            <Link to="/customer/ai-search">
              AI Search
            </Link>

            <Link to="/customer/profile">
              Size Recommendation
            </Link>

            <Link to="/customer/products">
              Product Recommendations
            </Link>

            <Link to="/customer/reviews">
              Review Insights
            </Link>

          </div>


          <div className="footer-column">

            <h4>
              Support
            </h4>

            <Link to="/customer/orders">
              Track Order
            </Link>

            <Link to="/customer/returns">
              Returns
            </Link>

            <Link to="/customer/profile">
              My Account
            </Link>

          </div>

        </div>


        <div className="footer-bottom">

          <div className="home-container">

            © 2026 ShopSense AI.
            Built for intelligent shopping.

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;