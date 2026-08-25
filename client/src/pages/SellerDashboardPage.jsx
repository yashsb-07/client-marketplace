import { Link } from "react-router-dom";
import "./SellerDashboardPage.css";

function SellerDashboardPage() {
  return (
    <main className="seller-dashboard">
      <section className="seller-dashboard__container">
        <header className="seller-dashboard__header">
          <div>
            <p className="seller-dashboard__eyebrow">
              Seller Portal
            </p>

            <h1>Seller Dashboard</h1>

            <p className="seller-dashboard__description">
              Manage your products and prepare them for the
              marketplace.
            </p>
          </div>

          <Link
            to="/marketplace"
            className="seller-dashboard__marketplace-link"
          >
            View Marketplace
          </Link>
        </header>

        <section className="seller-dashboard__content">
          <div className="seller-dashboard__card">
            <h2>My Products</h2>

            <p>
              Your seller products will appear here. Product
              creation and management will be added in the next
              seller implementation step.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

export default SellerDashboardPage;