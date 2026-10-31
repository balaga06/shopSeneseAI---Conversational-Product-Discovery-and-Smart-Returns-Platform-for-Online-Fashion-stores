import React, { useState } from "react"
import "./Admin.css"

function Products() {

  const [search, setSearch] = useState("")

  const products = [
    {
      id: 1,
      name: "Black Shirt",
      brand: "Codegnan",
      category: "Shirts",
      price: "₹800",
      stock: 43,
      status: "ACTIVE"
    },
    {
      id: 2,
      name: "Blue Jeans",
      brand: "Denim Co",
      category: "Jeans",
      price: "₹1,499",
      stock: 25,
      status: "ACTIVE"
    },
    {
      id: 3,
      name: "White Dress",
      brand: "Fashion Hub",
      category: "Dresses",
      price: "₹1,999",
      stock: 8,
      status: "ACTIVE"
    },
    {
      id: 4,
      name: "Casual T-Shirt",
      brand: "Urban Wear",
      category: "T-Shirts",
      price: "₹599",
      stock: 0,
      status: "OUT_OF_STOCK"
    }
  ]

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="admin-page">

      <div className="admin-header">

        <div>
          <h1>Product Management</h1>
          <p>
            Manage all products available in ShopSense AI.
          </p>
        </div>

        <button className="admin-primary-btn">
          + Add Product
        </button>

      </div>


      <div className="admin-panel">

        <div className="admin-toolbar">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search"
          />

          <select className="admin-filter">
            <option>All Categories</option>
            <option>Shirts</option>
            <option>T-Shirts</option>
            <option>Jeans</option>
            <option>Dresses</option>
          </select>

          <select className="admin-filter">
            <option>All Status</option>
            <option>ACTIVE</option>
            <option>OUT_OF_STOCK</option>
          </select>

        </div>


        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredProducts.map((product) => (

                <tr key={product.id}>

                  <td>
                    #{product.id}
                  </td>

                  <td>
                    <strong>
                      {product.name}
                    </strong>
                  </td>

                  <td>
                    {product.brand}
                  </td>

                  <td>
                    {product.category}
                  </td>

                  <td>
                    {product.price}
                  </td>

                  <td>
                    {product.stock}
                  </td>

                  <td>

                    <span
                      className={`status-badge ${
                        product.status === "ACTIVE"
                          ? "active"
                          : "out-of-stock"
                      }`}
                    >
                      {product.status}
                    </span>

                  </td>

                  <td>

                    <button className="admin-action-btn">
                      View
                    </button>

                    <button className="admin-action-btn">
                      Edit
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default Products