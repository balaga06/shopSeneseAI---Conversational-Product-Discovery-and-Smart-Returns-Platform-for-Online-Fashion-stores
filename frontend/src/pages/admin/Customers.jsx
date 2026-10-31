import React, { useState } from "react"
import "./Admin.css"

function Customers() {

  const [search, setSearch] = useState("")

  const customers = [
    {
      id: 1,
      name: "Nikhil Customer",
      email: "customer@gmail.com",
      phone: "+91 9876543210",
      orders: 12,
      returns: 2,
      status: "ACTIVE"
    },
    {
      id: 2,
      name: "Rahul Kumar",
      email: "rahul@gmail.com",
      phone: "+91 9876543211",
      orders: 8,
      returns: 1,
      status: "ACTIVE"
    },
    {
      id: 3,
      name: "Priya Sharma",
      email: "priya@gmail.com",
      phone: "+91 9876543212",
      orders: 15,
      returns: 4,
      status: "ACTIVE"
    },
    {
      id: 4,
      name: "Arjun Reddy",
      email: "arjun@gmail.com",
      phone: "+91 9876543213",
      orders: 4,
      returns: 0,
      status: "INACTIVE"
    }
  ]

  const filteredCustomers = customers.filter((customer) =>
    customer.name
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="admin-page">

      <div className="admin-header">

        <div>

          <h1>Customer Management</h1>

          <p>
            View and manage ShopSense AI customers.
          </p>

        </div>

      </div>


      <div className="admin-panel">

        <div className="admin-toolbar">

          <input
            type="text"
            className="admin-search"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select className="admin-filter">

            <option>
              All Customers
            </option>

            <option>
              ACTIVE
            </option>

            <option>
              INACTIVE
            </option>

          </select>

        </div>


        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Returns</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredCustomers.map((customer) => (

                <tr key={customer.id}>

                  <td>
                    #{customer.id}
                  </td>

                  <td>
                    <strong>
                      {customer.name}
                    </strong>
                  </td>

                  <td>
                    {customer.email}
                  </td>

                  <td>
                    {customer.phone}
                  </td>

                  <td>
                    {customer.orders}
                  </td>

                  <td>
                    {customer.returns}
                  </td>

                  <td>

                    <span
                      className={`status-badge ${customer.status.toLowerCase()}`}
                    >
                      {customer.status}
                    </span>

                  </td>

                  <td>

                    <button className="admin-action-btn">
                      View
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

export default Customers