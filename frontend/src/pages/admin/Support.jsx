import { useEffect, useState } from "react"
import api from "../../services/api"

function Support() {

  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const loadSupport = async () => {

      try {

        const response =
          await api.get("/admin/support")

        setQueries(response.data)

      } catch (error) {

        console.error(
          "Support loading error:",
          error
        )

      } finally {

        setLoading(false)

      }
    }

    loadSupport()

  }, [])

  return (

    <div>

      <div className="admin-page-header">

        <div>
          <h1>Support Management</h1>

          <p>
            Monitor customer support queries.
          </p>
        </div>

      </div>


      <div className="admin-table-card">

        {loading ? (

          <p className="admin-loading">
            Loading support queries...
          </p>

        ) : queries.length === 0 ? (

          <div className="admin-empty">
            No support queries found.
          </div>

        ) : (

          <table className="admin-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Agent</th>
              </tr>

            </thead>

            <tbody>

              {queries.map((query) => (

                <tr key={query.query_id}>

                  <td>
                    #{query.query_id}
                  </td>

                  <td>
                    {query.customer_name}
                  </td>

                  <td>
                    {query.subject}
                  </td>

                  <td>
                    {query.status}
                  </td>

                  <td>
                    {query.agent_name || "Unassigned"}
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

export default Support