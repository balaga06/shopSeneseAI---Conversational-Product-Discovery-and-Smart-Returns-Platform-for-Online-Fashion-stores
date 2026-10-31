import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./Admin.css"

function AdminLayout() {

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: "📊",
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: "👥",
    },
    {
      path: "/admin/sellers",
      label: "Sellers",
      icon: "🏪",
    },
    {
      path: "/admin/products",
      label: "Products",
      icon: "📦",
    },
    {
      path: "/admin/orders",
      label: "Orders",
      icon: "🛒",
    },
    {
      path: "/admin/returns",
      label: "Returns",
      icon: "↩️",
    },
    {
      path: "/admin/categories",
      label: "Categories",
      icon: "🗂️",
    },
    {
      path: "/admin/support",
      label: "Support",
      icon: "🎧",
    },
    {
      path: "/admin/analytics",
      label: "Analytics",
      icon: "📈",
    },
    {
      path: "/admin/notifications",
      label: "Notifications",
      icon: "🔔",
    },
    {
      path: "/admin/profile",
      label: "Profile",
      icon: "👤",
    },
  ]

  return (

    <div className="admin-layout">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside className="admin-sidebar">

        <div className="admin-logo">
          <h2>ShopSense AI</h2>
          <span>Admin Panel</span>
        </div>


        <nav className="admin-navigation">

          {menuItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "admin-nav-link active"
                  : "admin-nav-link"
              }
            >

              <span className="admin-nav-icon">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>

            </NavLink>

          ))}

        </nav>


        {/* ==================================================
            LOGOUT
        ================================================== */}

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>


      {/* ==================================================
          MAIN AREA
      ================================================== */}

      <main className="admin-main">

        <header className="admin-topbar">

          <div>
            <h3>Admin Dashboard</h3>
            <p>
              Manage ShopSense AI platform
            </p>
          </div>

          <div className="admin-user">

            <div className="admin-avatar">
              {user?.full_name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div>
              <strong>
                {user?.full_name || "Administrator"}
              </strong>

              <span>
                ADMIN
              </span>
            </div>

          </div>

        </header>


        <section className="admin-content">

          <Outlet />

        </section>

      </main>

    </div>
  )
}

export default AdminLayout