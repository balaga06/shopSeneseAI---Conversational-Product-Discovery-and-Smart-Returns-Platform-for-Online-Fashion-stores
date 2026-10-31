import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Support.css";

function SupportProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/auth/me"
      );

      setProfile(response.data);
    } catch (error) {
      console.error(
        "Support profile error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="support-page">
        <div className="support-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="support-page">

      <div className="support-header">

        <div>

          <h1>
            Support Profile
          </h1>

          <p>
            View your support agent account information.
          </p>

        </div>

      </div>

      <div className="support-profile-card">

        <div className="support-profile-avatar">
          {profile?.full_name
            ?.charAt(0)
            ?.toUpperCase() || "S"}
        </div>

        <div className="support-profile-info">

          <h2>
            {profile?.full_name ||
              "Support Agent"}
          </h2>

          <p>
            {profile?.email || "-"}
          </p>

          <span className="support-role-badge">
            {profile?.role ||
              "SUPPORT_AGENT"}
          </span>

        </div>

      </div>

      <div className="support-detail-card">

        <h2>
          Account Information
        </h2>

        <div className="support-detail-row">
          <span>User ID</span>
          <strong>
            #{profile?.user_id || "-"}
          </strong>
        </div>

        <div className="support-detail-row">
          <span>Full Name</span>
          <strong>
            {profile?.full_name || "-"}
          </strong>
        </div>

        <div className="support-detail-row">
          <span>Email</span>
          <strong>
            {profile?.email || "-"}
          </strong>
        </div>

        <div className="support-detail-row">
          <span>Phone</span>
          <strong>
            {profile?.phone || "-"}
          </strong>
        </div>

        <div className="support-detail-row">
          <span>Role</span>
          <strong>
            {profile?.role || "-"}
          </strong>
        </div>

        <div className="support-detail-row">
          <span>Account Status</span>
          <strong>
            {profile?.account_status || "-"}
          </strong>
        </div>

      </div>

    </div>
  );
}

export default SupportProfile;