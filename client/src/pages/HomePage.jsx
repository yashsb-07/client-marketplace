import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <p className="home-hero__eyebrow">
          CLIENT MARKETPLACE DEMO
        </p>

        <h1>
          Explore the complete marketplace workflow.
        </h1>

        <p className="home-hero__description">
          A client-friendly demonstration of the Buyer,
          Seller, and Admin experiences built into the
          marketplace application.
        </p>

        <div className="home-hero__actions">
          <Link
            to="/marketplace"
            className="home-button home-button--primary"
          >
            Explore Marketplace
          </Link>

          <Link
            to="/login"
            className="home-button"
          >
            Login
          </Link>
        </div>
      </section>

      <section className="home-workflows">
        <div className="home-section-header">
          <p className="home-section-header__eyebrow">
            DEMO WORKFLOWS
          </p>

          <h2>
            Choose a workflow to explore
          </h2>

          <p>
            Each section takes you directly to the
            existing application flow.
          </p>
        </div>

        <div className="home-workflow-grid">
          <article className="home-workflow-card">
            <p className="home-workflow-card__label">
              BUYER
            </p>

            <h3>
              Shop and complete a purchase
            </h3>

            <p>
              Browse products, search and filter the
              marketplace, view product details, manage
              the cart, continue to checkout, and complete
              the demo payment flow.
            </p>

            <Link
              to="/marketplace"
              className="home-workflow-card__link"
            >
              Start Buyer Workflow
            </Link>
          </article>

          <article className="home-workflow-card">
            <p className="home-workflow-card__label">
              SELLER
            </p>

            <h3>
              Manage marketplace products
            </h3>

            <p>
              Access the seller dashboard and manage
              products, including creating, editing,
              hiding or showing, and activating or
              deactivating products.
            </p>

            <Link
              to="/seller"
              className="home-workflow-card__link"
            >
              Start Seller Workflow
            </Link>
          </article>

          <article className="home-workflow-card">
            <p className="home-workflow-card__label">
              ADMIN
            </p>

            <h3>
              Monitor the marketplace
            </h3>

            <p>
              Access the admin dashboard to manage users
              and products and review marketplace orders
              and payments.
            </p>

            <Link
              to="/admin"
              className="home-workflow-card__link"
            >
              Start Admin Workflow
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}

export default HomePage;