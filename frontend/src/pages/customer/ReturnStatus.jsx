import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./Customer.css";

function ReturnStatus() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReturns();
  }, []);

  const loadReturns = async () => {
    try {
      const response = await api.get("/returns");
      setReturns(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-page">

      <div className="customer-container py-10">

        <h1 className="customer-title">
          My Returns
        </h1>

        <p className="customer-subtitle">
          Track your return and refund requests.
        </p>


        {loading ? (

          <div className="customer-loading">
            Loading returns...
          </div>

        ) : returns.length === 0 ? (

          <div className="customer-empty mt-8">
            <h2 className="text-xl font-bold">
              No return requests
            </h2>

            <p className="text-gray-500 mt-2">
              Your return requests will appear here.
            </p>
          </div>

        ) : (

          <div className="space-y-4 mt-8">

            {returns.map((item) => (

              <div
                key={item.return_id}
                className="customer-card p-5"
              >

                <div className="flex justify-between">

                  <div>

                    <span className="text-xs text-gray-500">
                      RETURN #{item.return_id}
                    </span>

                    <h3 className="font-bold mt-1">
                      {item.product_name}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      Reason: {item.reason}
                    </p>

                  </div>

                  <span className="h-fit px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                    {item.return_status}
                  </span>

                </div>


                {item.refund_amount && (

                  <p className="mt-4 font-bold">
                    Refund:
                    {" "}
                    ₹
                    {Number(
                      item.refund_amount
                    ).toLocaleString("en-IN")}
                  </p>

                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default ReturnStatus;