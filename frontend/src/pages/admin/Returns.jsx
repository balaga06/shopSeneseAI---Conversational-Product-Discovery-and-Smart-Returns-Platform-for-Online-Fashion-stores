import React from "react"
import "./Admin.css"

function Returns() {

  const returns = [
    {
      id: "#RET-1001",
      customer: "Rahul Kumar",
      product: "Black Shirt",
      reason: "Wrong Size",
      risk: "HIGH",
      status: "Pending"
    },
    {
      id: "#RET-1002",
      customer: "Priya Sharma",
      product: "Blue Jeans",
      reason: "Poor Fit",
      risk: "MEDIUM",
      status: "Approved"
    },
    {
      id: "#RET-1003",
      customer: "Arjun Reddy",
      product: "White Dress",
      reason: "Color Issue",
      risk: "LOW",
      status: "Pending"
    }
  ]

  return (
    <div className="admin-page">

      <div className="admin-header">

        <div>
          <h1>Return Management</h1>

          <p>
            Monitor customer returns and AI return-risk information.
          </p>

        </div>

      </div>


      <div className="admin-panel">

        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead>

              <tr>
                <th>Return ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Reason</th>
                <th>AI Risk</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {returns.map((item) => (

                <tr key={item.id}>

                  <td>
                    <strong>
                      {item.id}
                    </strong>
                  </td>

                  <td>
                    {item.customer}
                  </td>

                  <td>
                    {item.product}
                  </td>

                  <td>
                    {item.reason}
                  </td>

                  <td>

                    <span
                      className={`risk-badge ${item.risk.toLowerCase()}`}
                    >
                      {item.risk}
                    </span>

                  </td>

                  <td>

                    <span
                      className={`status-badge ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>

                  </td>

                  <td>

                    <button className="admin-action-btn">
                      Review
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

export default Returns