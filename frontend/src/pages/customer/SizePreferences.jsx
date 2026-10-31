import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Customer.css";

function SizePreferences() {
  const [form, setForm] = useState({
    height_cm: "",
    weight_kg: "",
    chest_cm: "",
    waist_cm: "",
    hip_cm: "",
    preferred_fit: "REGULAR",
    preferred_style: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/profile")
      .then((response) => {
        setForm({
          height_cm: response.data.height_cm || "",
          weight_kg: response.data.weight_kg || "",
          chest_cm: response.data.chest_cm || "",
          waist_cm: response.data.waist_cm || "",
          hip_cm: response.data.hip_cm || "",
          preferred_fit:
            response.data.preferred_fit ||
            "REGULAR",
          preferred_style:
            response.data.preferred_style || "",
        });
      })
      .catch(console.error);
  }, []);

  const updateField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const savePreferences = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await api.put(
        "/profile/size-preferences",
        form
      );

      alert(
        "Size preferences saved successfully."
      );

    } catch (error) {
      console.error(error);
      alert("Unable to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="customer-page">

      <div className="customer-container py-10 max-w-4xl">

        <div>

          <span className="text-indigo-600 font-bold text-xs">
            ✦ AI SIZE TECHNOLOGY
          </span>

          <h1 className="customer-title mt-2">
            Size Preferences
          </h1>

          <p className="customer-subtitle">
            Your measurements help ShopSense AI
            recommend the right size.
          </p>

        </div>


        <form
          onSubmit={savePreferences}
          className="customer-card p-6 mt-8"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {[
              ["height_cm", "Height (cm)"],
              ["weight_kg", "Weight (kg)"],
              ["chest_cm", "Chest (cm)"],
              ["waist_cm", "Waist (cm)"],
              ["hip_cm", "Hip (cm)"],
            ].map(([field, label]) => (

              <div key={field}>

                <label className="block text-sm font-bold mb-2">
                  {label}
                </label>

                <input
                  type="number"
                  step="0.1"
                  className="customer-input"
                  value={form[field]}
                  onChange={(e) =>
                    updateField(
                      field,
                      e.target.value
                    )
                  }
                />

              </div>

            ))}


            <div>

              <label className="block text-sm font-bold mb-2">
                Preferred Fit
              </label>

              <select
                className="customer-select"
                value={form.preferred_fit}
                onChange={(e) =>
                  updateField(
                    "preferred_fit",
                    e.target.value
                  )
                }
              >
                <option value="SLIM">
                  Slim
                </option>

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


            <div>

              <label className="block text-sm font-bold mb-2">
                Preferred Style
              </label>

              <input
                className="customer-input"
                placeholder="Casual, formal, streetwear..."
                value={form.preferred_style}
                onChange={(e) =>
                  updateField(
                    "preferred_style",
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          <div className="mt-6 p-5 bg-indigo-50 rounded-xl">

            <h3 className="font-bold text-indigo-900">
              Why we ask for measurements
            </h3>

            <p className="text-indigo-700 text-sm mt-2">
              ShopSense AI compares your measurements
              with the product's actual size chart to
              recommend a suitable size.
            </p>

          </div>


          <button
            className="customer-button mt-6"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Size Preferences"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default SizePreferences;