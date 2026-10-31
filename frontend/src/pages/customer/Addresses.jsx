import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Customer.css";

const emptyAddress = {
  full_name: "",
  phone: "",
  address_line: "",
  city: "",
  state: "",
  postal_code: "",
  country: "India",
  is_default: false,
};

function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyAddress);

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const response = await api.get("/addresses");
      setAddresses(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const updateField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const saveAddress = async (e) => {
    e.preventDefault();

    try {

      if (editingId) {

        await api.put(
          `/addresses/${editingId}`,
          form
        );

      } else {

        await api.post("/addresses", form);

      }

      setForm(emptyAddress);
      setEditingId(null);

      loadAddresses();

    } catch (error) {
      console.error(error);
    }
  };

  const editAddress = (address) => {
    setEditingId(address.address_id);
    setForm(address);
  };

  const deleteAddress = async (id) => {
    try {
      await api.delete(`/addresses/${id}`);
      loadAddresses();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="customer-page">

      <div className="customer-container py-10 max-w-5xl">

        <h1 className="customer-title">
          Addresses
        </h1>

        <p className="customer-subtitle">
          Manage your delivery addresses.
        </p>


        <form
          onSubmit={saveAddress}
          className="customer-card p-6 mt-8"
        >

          <h2 className="text-xl font-bold">
            {editingId
              ? "Edit Address"
              : "Add Address"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

            {[
              ["full_name", "Full Name"],
              ["phone", "Phone"],
              ["address_line", "Address"],
              ["city", "City"],
              ["state", "State"],
              ["postal_code", "Postal Code"],
            ].map(([field, label]) => (

              <div key={field}>

                <label className="block text-sm font-bold mb-2">
                  {label}
                </label>

                <input
                  className="customer-input"
                  value={form[field]}
                  onChange={(e) =>
                    updateField(
                      field,
                      e.target.value
                    )
                  }
                  required
                />

              </div>

            ))}

          </div>


          <label className="flex items-center gap-2 mt-5 text-sm">

            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) =>
                updateField(
                  "is_default",
                  e.target.checked
                )
              }
            />

            Make this my default address

          </label>


          <div className="flex gap-3 mt-6">

            <button className="customer-button">
              {editingId
                ? "Update Address"
                : "Save Address"}
            </button>

            {editingId && (

              <button
                type="button"
                className="customer-button secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyAddress);
                }}
              >
                Cancel
              </button>

            )}

          </div>

        </form>


        <div className="space-y-4 mt-7">

          {addresses.map((address) => (

            <div
              key={address.address_id}
              className="customer-card p-5"
            >

              <div className="flex justify-between">

                <div>

                  <strong>
                    {address.full_name}
                  </strong>

                  {address.is_default && (
                    <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                      Default
                    </span>
                  )}

                  <p className="text-gray-500 text-sm mt-2">
                    {address.address_line},{" "}
                    {address.city},{" "}
                    {address.state} -{" "}
                    {address.postal_code}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {address.phone}
                  </p>

                </div>

                <div className="flex gap-3">

                  <button
                    className="text-indigo-600 font-bold text-sm"
                    onClick={() =>
                      editAddress(address)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-600 font-bold text-sm"
                    onClick={() =>
                      deleteAddress(
                        address.address_id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Addresses;