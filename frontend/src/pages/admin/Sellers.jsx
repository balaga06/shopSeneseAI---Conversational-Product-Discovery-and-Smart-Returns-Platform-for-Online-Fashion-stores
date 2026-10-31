import { useEffect, useState } from "react"
import api from "../../services/api"

function Sellers() {

  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const loadSellers = async () => {

      try {

        const response =
          await api.get("/admin/sellers")

        setSellers(response.data)

      } catch (error) {

        console.error(
          "Sellers loading error:",
          error
        )

      } finally {

        setLoading(false)

      }
    }

    loadSellers()

  }, [])

  return (

    <div>

      <div className="admin-page-header">

        <div>
          <h1>Seller Management</h1>

          <p>
            Manage sellers and their products.
          </p>
        </div>

      </div>


      <div className="admin-table-card">

        {loading ? (

          <p className="admin-loading">
            Loading sellers...
          </p>

        ) : sellers.length === 0 ? (

          <div className="admin-empty">
            No sellers found.
          </div>

        ) : (

          <table className="admin-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Products</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {sellers.map((seller) => (

                <tr key={seller.user_id}>

                  <td>{seller.user_id}</td>

                  <td>{seller.full_name}</td>

                  <td>{seller.email}</td>

                  <td>
                    {seller.account_status}
                  </td>

                  <td>
                    {seller.product_count || 0}
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

export default Sellers