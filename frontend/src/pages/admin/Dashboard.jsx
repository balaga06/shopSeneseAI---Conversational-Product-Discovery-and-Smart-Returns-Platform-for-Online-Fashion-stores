import React from "react"
import { Link } from "react-router-dom"
import "./Admin.css"

function Dashboard() {

  const stats = [
    {
      title: "Total Customers",
      value: "2,486",
      change: "+12.5%",
      icon: "👥",
      link: "/admin/customers"
    },
    {
      title: "Total Products",
      value: "15,240",
      change: "+8.2%",
      icon: "📦",
      link: "/admin/products"
    },
    {
      title: "Total Orders",
      value: "8,642",
      change: "+15.4%",
      icon: "🛒",
      link: "/admin/orders"
    },
    {
      title: "Returns",
      value: "1,284",
      change: "14.8%",
      icon: "↩️",
      link: "/admin/returns"
    }
  ]

  const recentOrders = [
    {
      id: "#ORD-1001",
      customer: "Rahul Kumar",
      amount: "₹2,499",
      status: "Delivered"
    },
    {
      id: "#ORD-1002",
      customer: "Priya Sharma",
      amount: "₹1,899",
      status: "Processing"
    },
    {
      id: "#ORD-1003",
      customer: "Arjun Reddy",
      amount: "₹3,299",
      status: "Shipped"
    },
    {
      id: "#ORD-1004",
      customer: "Sneha Rao",
      amount: "₹1,499",
      status: "Returned"
    }
  ]

  const recentReturns = [
    {
      id: "#RET-1001",
      product: "Black Shirt",
      reason: "Wrong Size",
      status: "Pending"
    },
    {
      id: "#RET-1002",
      product: "Blue Jeans",
      reason: "Poor Fit",
      status: "Approved"
    },
    {
      id: "#RET-1003",
      product: "White Dress",
      reason: "Color Issue",
      status: "Pending"
    }
  ]

  return (
    <div className="admin-page">

      {/* HEADER */}

      <div className="admin-header">

        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Welcome to ShopSense AI administration panel.
          </p>
        </div>

        <div className="admin-header-date">
          📅 October 31, 2026
        </div>

      </div>


      {/* STAT CARDS */}

      <div className="admin-stat-grid">

        {stats.map((stat) => (

          <Link
            to={stat.link}
            className="admin-stat-card"
            key={stat.title}
          >

            <div className="admin-stat-icon">
              {stat.icon}
            </div>

            <div className="admin-stat-content">

              <span>
                {stat.title}
              </span>

              <strong>
                {stat.value}
              </strong>

              <small>
                {stat.change} from last month
              </small>

            </div>

          </Link>

        ))}

      </div>


      {/* MAIN GRID */}

      <div className="admin-dashboard-grid">

        {/* ORDERS */}

        <div className="admin-panel">

          <div className="admin-panel-header">

            <div>
              <h2>Recent Orders</h2>
              <p>Latest customer orders</p>
            </div>

            <Link to="/admin/orders">
              View All
            </Link>

          </div>

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {recentOrders.map((order) => (

                  <tr key={order.id}>

                    <td>
                      <strong>
                        {order.id}
                      </strong>
                    </td>

                    <td>
                      {order.customer}
                    </td>

                    <td>
                      {order.amount}
                    </td>

                    <td>

                      <span
                        className={`status-badge ${order.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {order.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>


        {/* RETURNS */}

        <div className="admin-panel">

          <div className="admin-panel-header">

            <div>
              <h2>Recent Returns</h2>
              <p>Return requests requiring attention</p>
            </div>

            <Link to="/admin/returns">
              View All
            </Link>

          </div>

          <div className="admin-return-list">

            {recentReturns.map((item) => (

              <div
                className="admin-return-item"
                key={item.id}
              >

                <div>

                  <strong>
                    {item.product}
                  </strong>

                  <span>
                    {item.id} • {item.reason}
                  </span>

                </div>

                <span
                  className={`status-badge ${item.status.toLowerCase()}`}
                >
                  {item.status}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>


      {/* QUICK ACTIONS */}

      <div className="admin-panel">

        <div className="admin-panel-header">

          <div>
            <h2>Quick Management</h2>
            <p>Manage major ShopSense AI modules</p>
          </div>

        </div>

        <div className="admin-quick-grid">

          <Link
            to="/admin/products"
            className="admin-quick-card"
          >
            <span>📦</span>
            <strong>Products</strong>
            <small>Manage catalogue</small>
          </Link>

          <Link
            to="/admin/customers"
            className="admin-quick-card"
          >
            <span>👥</span>
            <strong>Customers</strong>
            <small>Manage customers</small>
          </Link>

          <Link
            to="/admin/categories"
            className="admin-quick-card"
          >
            <span>🏷️</span>
            <strong>Categories</strong>
            <small>Manage categories</small>
          </Link>

          <Link
            to="/admin/analytics"
            className="admin-quick-card"
          >
            <span>📊</span>
            <strong>Analytics</strong>
            <small>View business insights</small>
          </Link>

        </div>

      </div>

    </div>
  )
}

export default Dashboard