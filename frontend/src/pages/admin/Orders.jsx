import React from "react"
import "./Admin.css"

function Orders() {

  const orders = [
    {
      id: "#ORD-1001",
      customer: "Rahul Kumar",
      product: "Black Shirt",
      amount: "₹800",
      status: "Delivered"
    },
    {
      id: "#ORD-1002",
      customer: "Priya Sharma",
      product: "Blue Jeans",
      amount: "₹1,499",
      status: "Processing"
    },
    {
      id: "#ORD-1003",
      customer: "Arjun Reddy",
      product: "White Dress",
      amount: "₹1,999",
      status: "Shipped"
    },
    {
      id: "#ORD-1004",
      customer: "Sneha Rao",
      product: "T-Shirt",
      amount: "₹599",
      status: "Cancelled"
    }
  ]

  return (
    <div className="admin-page">

      <div className="admin-header">

        <div>
          <h1>Order Management</h1>
          <p>
            Monitor and manage customer orders.
          </p>
        </div>

      </div>


      <div className="admin-panel">

        <div className="admin-toolbar">

          <input
            className="admin-search"
            placeholder="Search orders..."
          />

          <select className="admin-filter">
            <option>All Orders</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>

        </div>


        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead>

              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {orders.map((order) => (

                <tr key={order.id}>

                  <td>
                    <strong>{order.id}</strong>
                  </td>

                  <td>
                    {order.customer}
                  </td>

                  <td>
                    {order.product}
                  </td>

                  <td>
                    {order.amount}
                  </td>

                  <td>

                    <span
                      className={`status-badge ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>

                  </td>

                  <td>

                    <button className="admin-action-btn">
                      View Details
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

export default Orders