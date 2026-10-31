import React from "react"
import "./Admin.css"

function Analytics() {

  return (
    <div className="admin-page">

      <div className="admin-header">

        <div>

          <h1>Business Analytics</h1>

          <p>
            Monitor ShopSense AI business performance.
          </p>

        </div>

      </div>


      <div className="admin-stat-grid">

        <div className="admin-stat-card static">

          <div className="admin-stat-icon">
            💰
          </div>

          <div className="admin-stat-content">

            <span>
              Total Revenue
            </span>

            <strong>
              ₹24.8L
            </strong>

            <small>
              +18.4% this month
            </small>

          </div>

        </div>


        <div className="admin-stat-card static">

          <div className="admin-stat-icon">
            🛒
          </div>

          <div className="admin-stat-content">

            <span>
              Orders
            </span>

            <strong>
              8,642
            </strong>

            <small>
              +15.4%
            </small>

          </div>

        </div>


        <div className="admin-stat-card static">

          <div className="admin-stat-icon">
            ↩️
          </div>

          <div className="admin-stat-content">

            <span>
              Return Rate
            </span>

            <strong>
              14.8%
            </strong>

            <small>
              -3.2% improvement
            </small>

          </div>

        </div>


        <div className="admin-stat-card static">

          <div className="admin-stat-icon">
            ⭐
          </div>

          <div className="admin-stat-content">

            <span>
              Average Rating
            </span>

            <strong>
              4.4
            </strong>

            <small>
              From customer reviews
            </small>

          </div>

        </div>

      </div>


      <div className="admin-dashboard-grid">

        <div className="admin-panel">

          <div className="admin-panel-header">

            <div>

              <h2>Monthly Sales</h2>

              <p>
                Revenue performance
              </p>

            </div>

          </div>


          <div className="admin-chart">

            <div className="chart-bars">

              <div style={{ height: "45%" }}>
                <span>Jan</span>
              </div>

              <div style={{ height: "60%" }}>
                <span>Feb</span>
              </div>

              <div style={{ height: "52%" }}>
                <span>Mar</span>
              </div>

              <div style={{ height: "72%" }}>
                <span>Apr</span>
              </div>

              <div style={{ height: "65%" }}>
                <span>May</span>
              </div>

              <div style={{ height: "85%" }}>
                <span>Jun</span>
              </div>

              <div style={{ height: "95%" }}>
                <span>Jul</span>
              </div>

            </div>

          </div>

        </div>


        <div className="admin-panel">

          <div className="admin-panel-header">

            <div>

              <h2>Return Reasons</h2>

              <p>
                Customer return analysis
              </p>

            </div>

          </div>


          <div className="admin-reason-list">

            <div>
              <span>Wrong Size</span>
              <strong>42%</strong>
            </div>

            <div>
              <span>Poor Fit</span>
              <strong>28%</strong>
            </div>

            <div>
              <span>Product Quality</span>
              <strong>15%</strong>
            </div>

            <div>
              <span>Color Issue</span>
              <strong>9%</strong>
            </div>

            <div>
              <span>Other</span>
              <strong>6%</strong>
            </div>

          </div>

        </div>

      </div>


      <div className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <h2>AI Performance</h2>

            <p>
              ShopSense AI model insights
            </p>

          </div>

        </div>


        <div className="admin-ai-grid">

          <div className="admin-ai-card">

            <span>
              📏
            </span>

            <h3>
              Size Recommendation
            </h3>

            <strong>
              87.4%
            </strong>

            <p>
              Recommendation accuracy
            </p>

          </div>


          <div className="admin-ai-card">

            <span>
              ⚠️
            </span>

            <h3>
              Return Risk Prediction
            </h3>

            <strong>
              82.1%
            </strong>

            <p>
              Prediction accuracy
            </p>

          </div>


          <div className="admin-ai-card">

            <span>
              🤖
            </span>

            <h3>
              AI Product Search
            </h3>

            <strong>
              91.2%
            </strong>

            <p>
              Search relevance
            </p>

          </div>


          <div className="admin-ai-card">

            <span>
              ⭐
            </span>

            <h3>
              Review Summary
            </h3>

            <strong>
              94.5%
            </strong>

            <p>
              Summary satisfaction
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Analytics