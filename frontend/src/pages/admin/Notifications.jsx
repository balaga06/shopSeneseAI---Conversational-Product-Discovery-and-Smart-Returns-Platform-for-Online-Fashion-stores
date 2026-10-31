import { useEffect, useState } from "react"
import api from "../../services/api"

function Notifications() {

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const loadNotifications = async () => {

      try {

        const response =
          await api.get("/admin/notifications")

        setNotifications(response.data)

      } catch (error) {

        console.error(
          "Notifications loading error:",
          error
        )

      } finally {

        setLoading(false)

      }
    }

    loadNotifications()

  }, [])

  return (

    <div>

      <div className="admin-page-header">

        <div>

          <h1>
            Notifications
          </h1>

          <p>
            Platform alerts and system notifications.
          </p>

        </div>

      </div>


      {loading ? (

        <div className="admin-loading">
          Loading notifications...
        </div>

      ) : notifications.length === 0 ? (

        <div className="admin-empty">
          No notifications available.
        </div>

      ) : (

        <div className="admin-notification-list">

          {notifications.map((notification) => (

            <div
              className="admin-notification"
              key={notification.notification_id}
            >

              <div className="notification-icon">
                🔔
              </div>

              <div>

                <h3>
                  {notification.title}
                </h3>

                <p>
                  {notification.message}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  )
}

export default Notifications