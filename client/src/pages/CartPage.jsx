import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";

import "./CartPage.css";

function CartPage() {
  const {
    cart,
    loading,
    error,
    updateItem,
    removeItem,
    clear,
  } = useCart();

  if (loading && !cart) {
    return (
      <main className="cart-page">
        <section className="cart-state">
          <p>Loading your cart...</p>
        </section>
      </main>
    );
  }

  if (error && !cart) {
    return (
      <main className="cart-page">
        <section className="cart-state cart-state--error">
          <h1>Unable to load cart</h1>

          <p>{error}</p>

          <Link to="/marketplace">
            Back to Marketplace
          </Link>
        </section>
      </main>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <section className="cart-state">
          <h1>Your cart is empty</h1>

          <p>
            Add products from the marketplace
            to see them here.
          </p>

          <Link
            to="/marketplace"
            className="cart-primary-button"
          >
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  const subtotal = items.reduce(
    (total, item) =>
      total +
      Number(item.product.price) *
        item.quantity,
    0
  );

  const handleQuantityChange = async (
    productId,
    quantity
  ) => {
    if (quantity < 1) {
      return;
    }

    try {
      await updateItem(
        productId,
        quantity
      );
    } catch {
      // Error is already stored by CartContext.
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId);
    } catch {
      // Error is already stored by CartContext.
    }
  };

  const handleClear = async () => {
    try {
      await clear();
    } catch {
      // Error is already stored by CartContext.
    }
  };

  return (
    <main className="cart-page">
      <header className="cart-page__header">
        <div>
          <p className="cart-page__eyebrow">
            Buyer Cart
          </p>

          <h1>Your Cart</h1>
        </div>

        <Link
          to="/marketplace"
          className="cart-secondary-button"
        >
          Continue Shopping
        </Link>
      </header>

      {error && (
        <div className="cart-alert">
          {error}
        </div>
      )}

      <section className="cart-layout">
        <div className="cart-items">
          {items.map((item) => {
            const product = item.product;

            const itemTotal =
              Number(product.price) *
              item.quantity;

            return (
              <article
                key={item.id}
                className="cart-item"
              >
                <div className="cart-item__image-wrapper">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="cart-item__image"
                    />
                  ) : (
                    <div className="cart-item__image-placeholder">
                      No image
                    </div>
                  )}
                </div>

                <div className="cart-item__content">
                  <p className="cart-item__category">
                    {product.category?.name ||
                      "Uncategorized"}
                  </p>

                  <h2>{product.name}</h2>

                  <p className="cart-item__seller">
                    Sold by{" "}
                    {product.seller?.name ||
                      "Unknown seller"}
                  </p>

                  <p className="cart-item__price">
                    ₹
                    {Number(
                      product.price
                    ).toFixed(2)}
                  </p>
                </div>

                <div className="cart-item__controls">
                  <div className="cart-quantity">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(
                          product.id,
                          item.quantity - 1
                        )
                      }
                      disabled={
                        item.quantity <= 1
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(
                          product.id,
                          item.quantity + 1
                        )
                      }
                      disabled={
                        item.quantity >=
                        product.quantity
                      }
                    >
                      +
                    </button>
                  </div>

                  <strong>
                    ₹{itemTotal.toFixed(2)}
                  </strong>

                  <button
                    type="button"
                    className="cart-remove-button"
                    onClick={() =>
                      handleRemove(
                        product.id
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="cart-summary__row">
            <span>Items</span>

            <span>{items.length}</span>
          </div>

          <div className="cart-summary__row cart-summary__row--total">
            <span>Subtotal</span>

            <strong>
              ₹{subtotal.toFixed(2)}
            </strong>
          </div>

          <button
            type="button"
            className="cart-clear-button"
            onClick={handleClear}
          >
            Clear Cart
          </button>

          <p className="cart-summary__note">
            Checkout will be available in the
            next step.
          </p>
        </aside>
      </section>
    </main>
  );
}

export default CartPage;