import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import "./Customer.css";

function ProductListing() {
  const [searchParams] = useSearchParams();

  const categoryId = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    category: categoryId || "",
    gender: "",
    fit_type: "",
    min_price: "",
    max_price: "",
  });

  // ============================================================
  // LOAD CATEGORIES
  // ============================================================

  useEffect(() => {
    loadCategories();
  }, []);

  // ============================================================
  // LOAD PRODUCTS
  // ============================================================

  useEffect(() => {
    loadProducts();
  }, []);

  // ============================================================
  // LOAD CATEGORIES FROM BACKEND
  // ============================================================

  const loadCategories = async () => {
    try {
      const response = await api.get("/categories");

      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to load categories:", error);

      setCategories([]);
    }
  };

  // ============================================================
  // LOAD PRODUCTS FROM MYSQL
  // ============================================================

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products");

      console.log("Products loaded from backend:", response.data);

      setProducts(response.data || []);
    } catch (error) {
      console.error("Failed to load products:", error);

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // IMAGE URL HELPER
  // ============================================================

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return null;
    }

    // If backend already gives a complete URL
    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      return imageUrl;
    }

    // Backend returns something like:
    // /uploads/products/image.jpg

    return `http://127.0.0.1:8000${imageUrl}`;
  };

  // ============================================================
  // FILTER PRODUCTS
  // ============================================================

  const filteredProducts = products.filter((product) => {
    // ----------------------------------------------------------
    // SEARCH
    // ----------------------------------------------------------

    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      product.product_name?.toLowerCase().includes(searchText) ||
      product.brand?.toLowerCase().includes(searchText) ||
      product.description?.toLowerCase().includes(searchText);

    // ----------------------------------------------------------
    // CATEGORY
    // ----------------------------------------------------------

    const matchesCategory =
      !filters.category ||
      String(product.category_id) === String(filters.category);

    // ----------------------------------------------------------
    // GENDER
    // ----------------------------------------------------------

    const matchesGender =
      !filters.gender ||
      product.gender === filters.gender;

    // ----------------------------------------------------------
    // FIT TYPE
    // ----------------------------------------------------------

    const matchesFit =
      !filters.fit_type ||
      product.fit_type === filters.fit_type;

    // ----------------------------------------------------------
    // PRICE
    // ----------------------------------------------------------

    const productPrice = Number(
      product.discount_price || product.price || 0
    );

    const matchesMinPrice =
      !filters.min_price ||
      productPrice >= Number(filters.min_price);

    const matchesMaxPrice =
      !filters.max_price ||
      productPrice <= Number(filters.max_price);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesGender &&
      matchesFit &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  // ============================================================
  // HANDLE FILTER CHANGE
  // ============================================================

  const handleFilterChange = (field, value) => {
    setFilters((previousFilters) => ({
      ...previousFilters,
      [field]: value,
    }));
  };

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const clearFilters = () => {
    setSearch("");

    setFilters({
      category: "",
      gender: "",
      fit_type: "",
      min_price: "",
      max_price: "",
    });
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="customer-page">
      <div className="customer-container py-8">

        {/* ======================================================
            PAGE HEADER
        ====================================================== */}

        <div className="mb-8">

          <h1 className="customer-title">
            Discover Products
          </h1>

          <p className="customer-subtitle">
            Find products based on your style, size and preferences.
          </p>

        </div>

        {/* ======================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">

          {/* ====================================================
              FILTER SIDEBAR
          ==================================================== */}

          <aside className="customer-card p-5 h-fit">

            <div className="flex items-center justify-between mb-5">

              <h3 className="font-bold text-lg">
                Filters
              </h3>

              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:underline"
              >
                Clear
              </button>

            </div>

            {/* SEARCH */}

            <div className="mb-5">

              <label className="block text-sm font-semibold mb-2">
                Search
              </label>

              <input
                type="text"
                className="customer-input"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            {/* CATEGORY */}

            <div className="mb-5">

              <label className="block text-sm font-semibold mb-2">
                Category
              </label>

              <select
                className="customer-select"
                value={filters.category}
                onChange={(e) =>
                  handleFilterChange(
                    "category",
                    e.target.value
                  )
                }
              >

                <option value="">
                  All Categories
                </option>

                {categories.map((category) => (

                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </option>

                ))}

              </select>

            </div>

            {/* GENDER */}

            <div className="mb-5">

              <label className="block text-sm font-semibold mb-2">
                Gender
              </label>

              <select
                className="customer-select"
                value={filters.gender}
                onChange={(e) =>
                  handleFilterChange(
                    "gender",
                    e.target.value
                  )
                }
              >

                <option value="">
                  All
                </option>

                <option value="MEN">
                  Men
                </option>

                <option value="WOMEN">
                  Women
                </option>

                <option value="UNISEX">
                  Unisex
                </option>

                <option value="KIDS">
                  Kids
                </option>

              </select>

            </div>

            {/* FIT */}

            <div className="mb-5">

              <label className="block text-sm font-semibold mb-2">
                Fit
              </label>

              <select
                className="customer-select"
                value={filters.fit_type}
                onChange={(e) =>
                  handleFilterChange(
                    "fit_type",
                    e.target.value
                  )
                }
              >

                <option value="">
                  All Fits
                </option>

                <option value="SLIM">
                  Slim
                </option>

                <option value="REGULAR">
                  Regular
                </option>

                <option value="RELAXED">
                  Relaxed
                </option>

                <option value="OVERSIZED">
                  Oversized
                </option>

              </select>

            </div>

            {/* PRICE */}

            <div>

              <label className="block text-sm font-semibold mb-2">
                Price Range
              </label>

              <div className="grid grid-cols-2 gap-2">

                <input
                  type="number"
                  className="customer-input"
                  placeholder="Min ₹"
                  value={filters.min_price}
                  onChange={(e) =>
                    handleFilterChange(
                      "min_price",
                      e.target.value
                    )
                  }
                />

                <input
                  type="number"
                  className="customer-input"
                  placeholder="Max ₹"
                  value={filters.max_price}
                  onChange={(e) =>
                    handleFilterChange(
                      "max_price",
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

          </aside>

          {/* ====================================================
              PRODUCTS SECTION
          ==================================================== */}

          <section>

            {/* LOADING */}

            {loading ? (

              <div className="customer-loading">
                Loading products...
              </div>

            ) : filteredProducts.length === 0 ? (

              /* NO PRODUCTS */

              <div className="customer-empty">

                <h3 className="text-xl font-bold">
                  No products found
                </h3>

                <p className="text-gray-500 mt-2">
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 text-indigo-600 font-semibold hover:underline"
                >
                  Clear Filters
                </button>

              </div>

            ) : (

              <>

                {/* PRODUCT COUNT */}

                <div className="mb-4 text-sm text-gray-500">

                  Showing{" "}
                  <strong>
                    {filteredProducts.length}
                  </strong>{" "}
                  product
                  {filteredProducts.length !== 1 ? "s" : ""}

                </div>

                {/* PRODUCT GRID */}

                <div className="customer-grid">

                  {filteredProducts.map((product) => (

                    <Link
                      key={product.product_id}
                      to={`/customer/product/${product.product_id}`}
                      className="customer-card overflow-hidden no-underline text-inherit"
                    >

                      {/* PRODUCT IMAGE */}

                      <div className="h-64 bg-gray-100">

                        {product.image_url ? (

                          <img
                            src={getImageUrl(product.image_url)}
                            alt={product.product_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";
                            }}
                          />

                        ) : (

                          <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-500 text-4xl">
                            ✦
                          </div>

                        )}

                      </div>

                      {/* PRODUCT DETAILS */}

                      <div className="p-4">

                        {/* BRAND */}

                        <span className="text-xs text-indigo-600 font-bold">
                          {product.brand || "ShopSense"}
                        </span>

                        {/* NAME */}

                        <h3 className="font-bold mt-1">
                          {product.product_name}
                        </h3>

                        {/* CATEGORY */}

                        {product.category_name && (

                          <p className="text-gray-500 text-sm mt-1">
                            {product.category_name}
                          </p>

                        )}

                        {/* FIT */}

                        <p className="text-gray-500 text-sm mt-1">
                          {product.fit_type || "Regular"} Fit
                        </p>

                        {/* PRICE */}

                        <div className="mt-3">

                          <strong className="text-lg">

                            ₹
                            {Number(
                              product.discount_price ||
                                product.price ||
                                0
                            ).toLocaleString("en-IN")}

                          </strong>

                          {product.discount_price && (

                            <del className="text-gray-400 text-sm ml-2">

                              ₹
                              {Number(
                                product.price
                              ).toLocaleString("en-IN")}

                            </del>

                          )}

                        </div>

                        {/* STOCK */}

                        <div className="mt-2">

                          {Number(product.stock || 0) > 0 ? (

                            <span className="text-sm text-green-600">
                              In Stock
                            </span>

                          ) : (

                            <span className="text-sm text-red-600">
                              Out of Stock
                            </span>

                          )}

                        </div>

                      </div>

                    </Link>

                  ))}

                </div>

              </>

            )}

          </section>

        </div>

      </div>
    </div>
  );
}

export default ProductListing;