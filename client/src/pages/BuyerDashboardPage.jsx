import { useAuth } from "../context/useAuth";

function BuyerDashboardPage() {
  const {
    user,
    logout,
  } = useAuth();

  return (
    <main className="buyer-page">
      <section className="buyer-card">
        <div>
          <p className="buyer-card__eyebrow">
            Buyer Account
          </p>

          <h1>
            Welcome, {user.name}
          </h1>

          <p>
            You are logged in as a buyer.
          </p>
        </div>

        <div className="buyer-card__details">
          <div>
            <span>Name</span>
            <strong>{user.name}</strong>
          </div>

          <div>
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div>
            <span>Role</span>
            <strong>{user.role}</strong>
          </div>
        </div>

        <button
          type="button"
          className="buyer-card__logout"
          onClick={logout}
        >
          Logout
        </button>
      </section>
    </main>
  );
}

export default BuyerDashboardPage;