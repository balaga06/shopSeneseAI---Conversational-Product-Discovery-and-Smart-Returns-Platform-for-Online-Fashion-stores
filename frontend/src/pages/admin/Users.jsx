import { useEffect, useState } from "react"
import api from "../../services/api"

function Users() {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const loadUsers = async () => {

      try {

        const response = await api.get("/admin/users")

        setUsers(response.data)

      } catch (error) {

        console.error(
          "Users loading error:",
          error
        )

      } finally {

        setLoading(false)

      }
    }

    loadUsers()

  }, [])

  return (

    <div>

      <div className="admin-page-header">

        <div>
          <h1>User Management</h1>

          <p>
            Manage customers, sellers,
            support agents and administrators.
          </p>
        </div>

      </div>


      <div className="admin-table-card">

        {loading ? (

          <p className="admin-loading">
            Loading users...
          </p>

        ) : users.length === 0 ? (

          <div className="admin-empty">
            No users available.
          </div>

        ) : (

          <table className="admin-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {users.map((user) => (

                <tr key={user.user_id}>

                  <td>
                    {user.user_id}
                  </td>

                  <td>
                    {user.full_name}
                  </td>

                  <td>
                    {user.email}
                  </td>

                  <td>
                    <span className="admin-badge">
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        user.account_status === "ACTIVE"
                          ? "status-active"
                          : "status-inactive"
                      }
                    >
                      {user.account_status}
                    </span>
                  </td>

                  <td>
                    <button className="admin-small-button">
                      View
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  )
}

export default Users