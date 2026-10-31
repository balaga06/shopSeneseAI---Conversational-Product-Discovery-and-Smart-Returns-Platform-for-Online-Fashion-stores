import React from "react"
import "./Admin.css"

function AdminProfile() {

  return (
    <div className="admin-page">

      <div className="admin-header">

        <div>

          <h1>Admin Profile</h1>

          <p>
            Manage administrator account information.
          </p>

        </div>

      </div>


      <div className="admin-profile-grid">

        <div className="admin-panel admin-profile-card">

          <div className="admin-avatar">
            A
          </div>

          <h2>
            ShopSense Administrator
          </h2>

          <p>
            admin@shopsense.ai
          </p>

          <span className="status-badge active">
            ACTIVE
          </span>

        </div>


        <div className="admin-panel">

          <h2>
            Account Information
          </h2>

          <div className="admin-form-grid">

            <div className="admin-form-group">

              <label>
                Full Name
              </label>

              <input
                value="ShopSense Administrator"
                readOnly
              />

            </div>


            <div className="admin-form-group">

              <label>
                Email
              </label>

              <input
                value="admin@shopsense.ai"
                readOnly
              />

            </div>


            <div className="admin-form-group">

              <label>
                Role
              </label>

              <input
                value="ADMIN"
                readOnly
              />

            </div>


            <div className="admin-form-group">

              <label>
                Account Status
              </label>

              <input
                value="ACTIVE"
                readOnly
              />

            </div>

          </div>


          <button className="admin-primary-btn">
            Update Profile
          </button>

        </div>

      </div>

    </div>
  )
}

export default AdminProfile