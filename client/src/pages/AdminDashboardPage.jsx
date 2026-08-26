import { useEffect, useState } from "react";

import {
  blockAdminUser,
  getAdminBuyers,
  getAdminDashboard,
  getAdminSellers,
  unblockAdminUser,
} from "../services/adminService";

import "./AdminDashboardPage.css";

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState(null);

  const [error, setError] = useState("");
  const [userError, setUserError] = useState("");
  const [userSuccess, setUserSuccess] = useState("");

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

  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        setUserError("");

        const [sellerData, buyerData] = await Promise.all([
          getAdminSellers(),
          getAdminBuyers(),
        ]);

        if (!cancelled) {
          setSellers(sellerData);
          setBuyers(buyerData);
        }
      } catch (err) {
        console.error("Admin users request failed:", err);

        if (!cancelled) {
          setUserError(
            err.response?.data?.message ||
              "Unable to load admin users.",
          );
        }
      } finally {
        if (!cancelled) {
          setUsersLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleUserStatusChange = async (userId, shouldBlock) => {
    try {
      setActionUserId(userId);
      setUserError("");
      setUserSuccess("");

      const response = shouldBlock
        ? await blockAdminUser(userId)
        : await unblockAdminUser(userId);

      const updatedUser = response.data;

      const updateUsers = (users) =>
        users.map((user) =>
          user.id === updatedUser.id ? updatedUser : user,
        );

      setSellers((current) => updateUsers(current));
      setBuyers((current) => updateUsers(current));

      setUserSuccess(response.message);
    } catch (err) {
      console.error("Admin user status update failed:", err);

      setUserError(
        err.response?.data?.message ||
          "Unable to update the user status.",
      );
    } finally {
      setActionUserId(null);
    }
  };

  const renderUser = (user) => {
    const isBlocked = user.isBlocked === true;

    return (
      <article className="admin-user-card" key={user.id}>
        <div className="admin-user-card-info">
          <h3>{user.name}</h3>

          <p>{user.email}</p>

          <span
            className={
              isBlocked
                ? "admin-user-status blocked"
                : "admin-user-status active"
            }
          >
            {isBlocked ? "Blocked" : "Active"}
          </span>
        </div>

        <button
          type="button"
          className="admin-user-action-button"
          onClick={() =>
            handleUserStatusChange(user.id, !isBlocked)
          }
          disabled={actionUserId === user.id}
        >
          {actionUserId === user.id
            ? "Updating..."
            : isBlocked
              ? "Unblock User"
              : "Block User"}
        </button>
      </article>
    );
  };

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

      <section className="admin-dashboard-section">
        <h2>Seller Management</h2>

        {userError && (
          <div className="admin-user-message error">
            {userError}
          </div>
        )}

        {userSuccess && (
          <div className="admin-user-message success">
            {userSuccess}
          </div>
        )}

        {usersLoading ? (
          <p>Loading sellers...</p>
        ) : sellers.length === 0 ? (
          <div className="admin-user-empty">
            <p>No sellers found.</p>
          </div>
        ) : (
          <div className="admin-users-list">
            {sellers.map(renderUser)}
          </div>
        )}
      </section>

      <section className="admin-dashboard-section">
        <h2>Buyer Management</h2>

        {usersLoading ? (
          <p>Loading buyers...</p>
        ) : buyers.length === 0 ? (
          <div className="admin-user-empty">
            <p>No buyers found.</p>
          </div>
        ) : (
          <div className="admin-users-list">
            {buyers.map(renderUser)}
          </div>
        )}
      </section>
    </main>
  );
}