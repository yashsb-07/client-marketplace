import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/useCart";
import { createOrder } from "../services/orderService";

import "./CheckoutPage.css";

function CheckoutPage() {
  const navigate = useNavigate();

  const { cart, loading: cartLoading, error: cartError } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (cartLoading && !cart) {
    return (
      <main className="checkout-page">
        <section className="checkout-state">
          <p>Loading your checkout...</p>
        </section>
      </main>
    );
  }

  if (cartError && !cart) {
    return (
      <main className="checkout-page">
        <section className="checkout-state checkout-state--error">
          <h1>Unable to load checkout</h1>

          <p>{cartError}</p>

          <Link to="/cart">Back to Cart</Link>
        </section>
      </main>
    );
  }

  const items = cart?.items || [];

  const subtotal = items.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0,
  );

  const handlePlaceOrder = async () => {
    try {
      setSubmitting(true);
      setError("");

      const response = await createOrder();

      const createdOrder = response.data;

      navigate("/payment", {
        state: {
          order: createdOrder,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create your order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="checkout-page">
      <header className="checkout-page__header">
        <div>
          <p className="checkout-page__eyebrow">Buyer Checkout</p>

          <h1>Review Your Order</h1>
        </div>

        <Link to="/cart" className="checkout-secondary-button">
          Back to Cart
        </Link>
      </header>

      {error && <div className="checkout-alert">{error}</div>}

      <section className="checkout-layout">
        <div className="checkout-items">
          <h2>Items</h2>

          {items.map((item) => {
            const product = item.product;

            const itemTotal = Number(product.price) * item.quantity;

            return (
              <article key={item.id} className="checkout-item">
                <div className="checkout-item__image-wrapper">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="checkout-item__image"
                    />
                  ) : (
                    <div className="checkout-item__image-placeholder">
                      No image
                    </div>
                  )}
                </div>

                <div className="checkout-item__content">
                  <p>{product.category?.name || "Uncategorized"}</p>

                  <h3>{product.name}</h3>

                  <span>Quantity: {item.quantity}</span>
                </div>

                <strong>₹{itemTotal.toFixed(2)}</strong>
              </article>
            );
          })}
        </div>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="checkout-summary__row">
            <span>Items</span>
            <span>{items.length}</span>
          </div>

          <div className="checkout-summary__row checkout-summary__row--total">
            <span>Total</span>

            <strong>₹{subtotal.toFixed(2)}</strong>
          </div>

          <button
            type="button"
            className="checkout-primary-button checkout-place-order"
            onClick={handlePlaceOrder}
            disabled={submitting}
          >
            {submitting ? "Creating Order..." : "Place Order"}
          </button>

          <p className="checkout-summary__note">
            Payment will be handled separately after order creation.
          </p>
        </aside>
      </section>
    </main>
  );
}

export default CheckoutPage;
