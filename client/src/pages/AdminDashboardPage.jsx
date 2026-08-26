import { useEffect, useState } from "react";

import {
  blockAdminUser,
  getAdminBuyers,
  getAdminDashboard,
  getAdminOrders,
  getAdminPayments,
  getAdminProducts,
  getAdminSellers,
  unblockAdminUser,
} from "../services/adminService";

import "./AdminDashboardPage.css";

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productError, setProductError] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderError, setOrderError] = useState("");

  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentError, setPaymentError] = useState("");

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
            err.response?.data?.message || "Unable to load admin users.",
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

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setProductError("");

        const data = await getAdminProducts();

        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Admin products request failed:", err);

        if (!cancelled) {
          setProductError(
            err.response?.data?.message || "Unable to load admin products.",
          );
        }
      } finally {
        if (!cancelled) {
          setProductsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        setOrderError("");

        const data = await getAdminOrders();

        if (!cancelled) {
          setOrders(data);
        }
      } catch (err) {
        console.error("Admin orders request failed:", err);

        if (!cancelled) {
          setOrderError(
            err.response?.data?.message || "Unable to load admin orders.",
          );
        }
      } finally {
        if (!cancelled) {
          setOrdersLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchPayments = async () => {
      try {
        setPaymentsLoading(true);
        setPaymentError("");

        const data = await getAdminPayments();

        if (!cancelled) {
          setPayments(data);
        }
      } catch (err) {
        console.error("Admin payments request failed:", err);

        if (!cancelled) {
          setPaymentError(
            err.response?.data?.message || "Unable to load admin payments.",
          );
        }
      } finally {
        if (!cancelled) {
          setPaymentsLoading(false);
        }
      }
    };

    fetchPayments();

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
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user));

      setSellers((current) => updateUsers(current));
      setBuyers((current) => updateUsers(current));

      setUserSuccess(response.message);
    } catch (err) {
      console.error("Admin user status update failed:", err);

      setUserError(
        err.response?.data?.message || "Unable to update the user status.",
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
          onClick={() => handleUserStatusChange(user.id, !isBlocked)}
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

  const renderProduct = (product) => {
    const isVisible = product.isVisible === true;
    const isActive = product.status === "ACTIVE";

    return (
      <article className="admin-product-card" key={product.id}>
        {product.imageUrl && (
          <img
            className="admin-product-image"
            src={product.imageUrl}
            alt={product.name}
          />
        )}

        <div className="admin-product-card-content">
          <h3>{product.name}</h3>

          <p>{product.description}</p>

          <div className="admin-product-meta">
            <span>Price: ₹{product.price}</span>
            <span>Quantity: {product.quantity}</span>
          </div>

          {product.category && <span>Category: {product.category.name}</span>}

          {product.seller && (
            <div className="admin-product-seller">
              <strong>Seller</strong>
              <span>{product.seller.name}</span>
              <span>{product.seller.email}</span>
            </div>
          )}

          <div className="admin-product-statuses">
            <span
              className={
                isVisible
                  ? "admin-product-status visible"
                  : "admin-product-status hidden"
              }
            >
              {isVisible ? "Visible" : "Hidden"}
            </span>

            <span
              className={
                isActive
                  ? "admin-product-status active"
                  : "admin-product-status inactive"
              }
            >
              {isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>
        </div>
      </article>
    );
  };

  const renderOrder = (order) => {
    return (
      <article className="admin-order-card" key={order.id}>
        <div className="admin-order-header">
          <div>
            <h3>Order #{order.id}</h3>

            {order.buyer && (
              <div className="admin-order-buyer">
                <strong>{order.buyer.name}</strong>
                <span>{order.buyer.email}</span>
              </div>
            )}
          </div>

          <div className="admin-order-statuses">
            <span className="admin-order-status">{order.status}</span>

            <span className="admin-order-payment-status">
              Payment: {order.paymentStatus}
            </span>
          </div>
        </div>

        <div className="admin-order-summary">
          <span>Total: ₹{order.total}</span>

          <span>Date: {new Date(order.createdAt).toLocaleString()}</span>
        </div>

        <div className="admin-order-items">
          <h4>Items</h4>

          {order.items?.map((item) => (
            <div className="admin-order-item" key={item.id}>
              <div>
                <strong>{item.productName}</strong>

                <span>Quantity: {item.quantity}</span>
              </div>

              <div className="admin-order-item-prices">
                <span>Unit: ₹{item.unitPrice}</span>

                <span>Total: ₹{item.totalPrice}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-order-payment">
          <h4>Payment</h4>

          {order.payment ? (
            <>
              <span>Status: {order.payment.status}</span>

              <span>Transaction: {order.payment.transactionId}</span>

              <span>Amount: ₹{order.payment.amount}</span>
            </>
          ) : (
            <span>No payment record yet.</span>
          )}
        </div>
      </article>
    );
  };

  const renderPayment = (payment) => {
    return (
      <article className="admin-payment-card" key={payment.id}>
        <div className="admin-payment-header">
          <div>
            <h3>Payment #{payment.id}</h3>

            <span>Order #{payment.orderId}</span>
          </div>

          <span className="admin-payment-status">{payment.status}</span>
        </div>

        {payment.order?.buyer && (
          <div className="admin-payment-buyer">
            <strong>{payment.order.buyer.name}</strong>
            <span>{payment.order.buyer.email}</span>
          </div>
        )}

        <div className="admin-payment-details">
          <span>Amount: ₹{payment.amount}</span>

          <span>Order Status: {payment.order?.status || "Unavailable"}</span>

          <span>
            Payment Status: {payment.order?.paymentStatus || "Unavailable"}
          </span>

          <span>Transaction: {payment.transactionId}</span>

          <span>Date: {new Date(payment.createdAt).toLocaleString()}</span>
        </div>
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

          <p>Monitor the marketplace platform from one place.</p>
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
        <h2>Product Management</h2>

        {productError && (
          <div className="admin-user-message error">{productError}</div>
        )}

        {productsLoading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <div className="admin-user-empty">
            <p>No products found.</p>
          </div>
        ) : (
          <div className="admin-products-list">
            {products.map(renderProduct)}
          </div>
        )}
      </section>

      <section className="admin-dashboard-section">
        <h2>Orders</h2>

        <div className="admin-dashboard-grid">
          <article className="admin-dashboard-card">
            <span>Total Orders</span>
            <strong>{dashboard.orders}</strong>
          </article>
        </div>

        {orderError && (
          <div className="admin-user-message error">{orderError}</div>
        )}

        {ordersLoading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="admin-user-empty">
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="admin-orders-list">{orders.map(renderOrder)}</div>
        )}
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
        <h2>Payment Management</h2>

        {paymentError && (
          <div className="admin-user-message error">{paymentError}</div>
        )}

        {paymentsLoading ? (
          <p>Loading payments...</p>
        ) : payments.length === 0 ? (
          <div className="admin-user-empty">
            <p>No payments found.</p>
          </div>
        ) : (
          <div className="admin-payments-list">
            {payments.map(renderPayment)}
          </div>
        )}
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
          <div className="admin-user-message error">{userError}</div>
        )}

        {userSuccess && (
          <div className="admin-user-message success">{userSuccess}</div>
        )}

        {usersLoading ? (
          <p>Loading sellers...</p>
        ) : sellers.length === 0 ? (
          <div className="admin-user-empty">
            <p>No sellers found.</p>
          </div>
        ) : (
          <div className="admin-users-list">{sellers.map(renderUser)}</div>
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
          <div className="admin-users-list">{buyers.map(renderUser)}</div>
        )}
      </section>
    </main>
  );
}
