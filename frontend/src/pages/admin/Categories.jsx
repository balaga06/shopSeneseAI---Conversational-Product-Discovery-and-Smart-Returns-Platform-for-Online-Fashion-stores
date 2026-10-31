import React, { useState } from "react"
import "./Admin.css"

function Categories() {

  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Shirts",
      products: 320,
      status: "ACTIVE"
    },
    {
      id: 2,
      name: "T-Shirts",
      products: 480,
      status: "ACTIVE"
    },
    {
      id: 3,
      name: "Jeans",
      products: 210,
      status: "ACTIVE"
    },
    {
      id: 4,
      name: "Dresses",
      products: 350,
      status: "ACTIVE"
    },
    {
      id: 5,
      name: "Shoes",
      products: 420,
      status: "ACTIVE"
    }
  ])

  const [newCategory, setNewCategory] = useState("")

  const addCategory = () => {

    if (!newCategory.trim()) {
      return
    }

    const newItem = {
      id: categories.length + 1,
      name: newCategory,
      products: 0,
      status: "ACTIVE"
    }

    setCategories([
      ...categories,
      newItem
    ])

    setNewCategory("")
  }

  return (
    <div className="admin-page">

      <div className="admin-header">

        <div>

          <h1>Category Management</h1>

          <p>
            Manage product categories.
          </p>

        </div>

      </div>


      <div className="admin-panel">

        <div className="admin-category-add">

          <input
            className="admin-search"
            placeholder="Enter category name"
            value={newCategory}
            onChange={(e) =>
              setNewCategory(e.target.value)
            }
          />

          <button
            className="admin-primary-btn"
            onClick={addCategory}
          >
            + Add Category
          </button>

        </div>


        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Products</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {categories.map((category) => (

                <tr key={category.id}>

                  <td>
                    #{category.id}
                  </td>

                  <td>
                    <strong>
                      {category.name}
                    </strong>
                  </td>

                  <td>
                    {category.products}
                  </td>

                  <td>

                    <span className="status-badge active">
                      {category.status}
                    </span>

                  </td>

                  <td>

                    <button className="admin-action-btn">
                      Edit
                    </button>

                    <button className="admin-action-btn danger">
                      Delete
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

export default Categories