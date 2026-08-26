import { useEffect, useState } from "react";

import { getAdminDashboard } from "../services/adminService";

import "./AdminDashboardPage.css";

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminDashboard();

        if (!cancelled) {
          setDashboard(data);
        }
      } catch (err) {
        console.error("Admin dashboard request failed:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load the admin dashboard.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main className="admin-dashboard-page">
        <section className="admin-dashboard-state">
          <h1>Admin Dashboard</h1>
          <p>Loading dashboard...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-dashboard-page">
        <section className="admin-dashboard-state error">
          <h1>Admin Dashboard</h1>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-dashboard-page">
      <section className="admin-dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Monitor the marketplace platform from one place.
          </p>
        </div>
      </section>

      <section className="admin-dashboard-section">
        <h2>Users</h2>

        <div className="admin-dashboard-grid">
          <article className="admin-dashboard-card">
            <span>Sellers</span>
            <strong>{dashboard.sellers}</strong>
          </article>

          <article className="admin-dashboard-card">
            <span>Buyers</span>
            <strong>{dashboard.buyers}</strong>
          </article>
        </div>
      </section>

      <section className="admin-dashboard-section">
        <h2>Products</h2>

        <div className="admin-dashboard-grid">
          <article className="admin-dashboard-card">
            <span>Total Products</span>
            <strong>{dashboard.products}</strong>
          </article>

          <article className="admin-dashboard-card">
            <span>Active Products</span>
            <strong>{dashboard.activeProducts}</strong>
          </article>

          <article className="admin-dashboard-card">
            <span>Inactive Products</span>
            <strong>{dashboard.inactiveProducts}</strong>
          </article>

          <article className="admin-dashboard-card">
            <span>Visible Products</span>
            <strong>{dashboard.visibleProducts}</strong>
          </article>

          <article className="admin-dashboard-card">
            <span>Hidden Products</span>
            <strong>{dashboard.hiddenProducts}</strong>
          </article>
        </div>
      </section>

      <section className="admin-dashboard-section">
        <h2>Orders</h2>

        <div className="admin-dashboard-grid">
          <article className="admin-dashboard-card">
            <span>Total Orders</span>
            <strong>{dashboard.orders}</strong>
          </article>
        </div>
      </section>

      <section className="admin-dashboard-section">
        <h2>Payments</h2>

        <div className="admin-dashboard-grid">
          <article className="admin-dashboard-card">
            <span>Successful</span>
            <strong>{dashboard.successfulPayments}</strong>
          </article>

          <article className="admin-dashboard-card">
            <span>Pending</span>
            <strong>{dashboard.pendingPayments}</strong>
          </article>

          <article className="admin-dashboard-card">
            <span>Failed</span>
            <strong>{dashboard.failedPayments}</strong>
          </article>

          <article className="admin-dashboard-card">
            <span>Cancelled</span>
            <strong>{dashboard.cancelledPayments}</strong>
          </article>
        </div>
      </section>

      <section className="admin-dashboard-section">
        <h2>Revenue</h2>

        <div className="admin-dashboard-revenue-card">
          <span>Total Revenue</span>
          <strong>₹{dashboard.revenue}</strong>
        </div>
      </section>
    </main>
  );
}