import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./Customer.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get("/profile");
      setProfile(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setProfile({
      ...profile,
      [field]: value,
    });
  };

  const saveProfile = async () => {
    try {
      setSaving(true);

      await api.put("/profile", profile);

      alert("Profile updated successfully.");

    } catch (error) {
      console.error(error);
      alert("Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="customer-loading">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="customer-empty">
        Unable to load profile.
      </div>
    );
  }

  return (
    <div className="customer-page">

      <div className="customer-container py-10 max-w-4xl">

        <h1 className="customer-title">
          My Profile
        </h1>

        <p className="customer-subtitle">
          Manage your account and shopping preferences.
        </p>


        <div className="customer-card p-6 mt-8">

          <h2 className="text-xl font-bold">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

            <div>
              <label className="block text-sm font-bold mb-2">
                Full Name
              </label>

              <input
                className="customer-input"
                value={profile.full_name || ""}
                onChange={(e) =>
                  updateField(
                    "full_name",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Email
              </label>

              <input
                className="customer-input bg-gray-50"
                value={profile.email || ""}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Phone
              </label>

              <input
                className="customer-input"
                value={profile.phone || ""}
                onChange={(e) =>
                  updateField(
                    "phone",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Preferred Fit
              </label>

              <select
                className="customer-select"
                value={
                  profile.preferred_fit ||
                  "REGULAR"
                }
                onChange={(e) =>
                  updateField(
                    "preferred_fit",
                    e.target.value
                  )
                }
              >
                <option value="SLIM">Slim</option>
                <option value="REGULAR">
                  Regular
                </option>
                <option value="RELAXED">
                  Relaxed
                </option>
                <option value="OVERSIZED">
                  Oversized
                </option>
              </select>
            </div>

          </div>

          <button
            className="customer-button mt-7"
            onClick={saveProfile}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Profile"}
          </button>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

          <Link
            to="/customer/addresses"
            className="customer-card p-5 no-underline text-inherit"
          >
            <strong>
              Addresses
            </strong>

            <p className="text-gray-500 text-sm mt-2">
              Manage delivery addresses.
            </p>
          </Link>


          <Link
            to="/customer/size-preferences"
            className="customer-card p-5 no-underline text-inherit"
          >
            <strong>
              Size Preferences
            </strong>

            <p className="text-gray-500 text-sm mt-2">
              Manage measurements for AI sizing.
            </p>
          </Link>


          <Link
            to="/customer/orders"
            className="customer-card p-5 no-underline text-inherit"
          >
            <strong>
              My Orders
            </strong>

            <p className="text-gray-500 text-sm mt-2">
              View your purchase history.
            </p>
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Profile;