import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./Support.css";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/support/customers"
      );

      setCustomers(response.data || []);
    } catch (error) {
      console.error("Customers loading error:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) => {

      const text = search.toLowerCase();

      return (
        String(customer.full_name || "")
          .toLowerCase()
          .includes(text) ||
        String(customer.email || "")
          .toLowerCase()
          .includes(text) ||
        String(customer.phone || "")
          .toLowerCase()
          .includes(text)
      );
    }
  );

  return (
    <div className="support-page">

      <div className="support-header">

        <div>

          <h1>
            Customers
          </h1>

          <p>
            Search customers and view their support history.
          </p>

        </div>

        <button
          className="support-refresh-btn"
          onClick={loadCustomers}
        >
          Refresh
        </button>

      </div>

      <div className="support-filter-card">

        <input
          type="text"
          className="support-input"
          placeholder="Search name, email or phone..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {loading ? (

        <div className="support-loading">
          Loading customers...
        </div>

      ) : filteredCustomers.length === 0 ? (

        <div className="support-empty">

          <h3>
            No customers found
          </h3>

          <p>
            No customers match your search.
          </p>

        </div>

      ) : (

        <div className="support-table-card">

          <table className="support-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Account Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredCustomers.map(
                (customer) => (

                  <tr
                    key={customer.user_id}
                  >

                    <td>
                      #{customer.user_id}
                    </td>

                    <td>
                      <strong>
                        {customer.full_name}
                      </strong>
                    </td>

                    <td>
                      {customer.email}
                    </td>

                    <td>
                      {customer.phone || "-"}
                    </td>

                    <td>

                      <span
                        className={`support-status ${
                          String(
                            customer.account_status ||
                            "ACTIVE"
                          ).toLowerCase()
                        }`}
                      >
                        {customer.account_status ||
                          "ACTIVE"}
                      </span>

                    </td>

                    <td>

                      <Link
                        to={`/support/customers/${customer.user_id}`}
                        className="support-view-btn"
                      >
                        View
                      </Link>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default Customers;