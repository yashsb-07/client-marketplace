import { Link } from "react-router-dom";
import "./SellerDashboardPage.css";

function SellerDashboardPage() {
  return (
    <main className="seller-dashboard">
      <section className="seller-dashboard__container">
        <header className="seller-dashboard__header">
          <div>
            <p className="seller-dashboard__eyebrow">Seller Portal</p>

            <h1>Seller Dashboard</h1>

            <p className="seller-dashboard__description">
              Manage your products and prepare them for the marketplace.
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

            <p>Create and manage the products you sell in the marketplace.</p>

            <Link
              to="/seller/products"
              className="seller-dashboard__products-link"
            >
              Manage My Products
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

export default SellerDashboardPage;
