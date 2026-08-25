import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getMarketplaceProductById } from "../services/marketplaceService";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cartQuantity, setCartQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  const { addItem, error: cartError } = useCart();

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMarketplaceProductById(id);

        if (cancelled) {
          return;
        }

        setProduct(data);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Product details request failed:",
          err
        );

        if (err.response?.status === 404) {
          setError("Product not found.");
        } else {
          setError(
            "Unable to load product details. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!product || product.quantity <= 0) {
      return;
    }

    try {
      setAddingToCart(true);
      setCartMessage("");

      await addItem(product.id, cartQuantity);

      setCartMessage("Product added to your cart.");
    } catch {
      // CartContext stores the backend error.
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (event) => {
    const value = Number(event.target.value);

    if (
      Number.isInteger(value) &&
      value >= 1 &&
      value <= product.quantity
    ) {
      setCartQuantity(value);
    }
  };

  if (loading) {
    return (
      <main className="product-details-page">
        <section className="product-details-state">
          <div className="loading-spinner" />

          <p>Loading product details...</p>
        </section>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-details-page">
        <section className="product-details-state product-details-state--error">
          <h1>{error || "Product not found."}</h1>

          <p>
            The product may no longer be available.
          </p>

          <Link
            to="/marketplace"
            className="product-details-back"
          >
            Back to Marketplace
          </Link>
        </section>
      </main>
    );
  }

  const isAvailable = product.quantity > 0;

  return (
    <main className="product-details-page">
      <Link
        to="/marketplace"
        className="product-details-back"
      >
        ← Back to Marketplace
      </Link>

      <section className="product-details">
        <div className="product-details__image-wrapper">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-details__image"
            />
          ) : (
            <div className="product-details__image-placeholder">
              No image available
            </div>
          )}
        </div>

        <div className="product-details__content">
          <p className="product-details__category">
            {product.category?.name || "Uncategorized"}
          </p>

          <h1 className="product-details__name">
            {product.name}
          </h1>

          <p className="product-details__seller">
            Sold by{" "}
            <strong>
              {product.seller?.name || "Unknown seller"}
            </strong>
          </p>

          <div className="product-details__price">
            ₹{Number(product.price).toFixed(2)}
          </div>

          <div className="product-details__availability">
            <span
              className={
                isAvailable
                  ? "product-details__badge product-details__badge--available"
                  : "product-details__badge product-details__badge--out"
              }
            >
              {isAvailable ? "In Stock" : "Out of Stock"}
            </span>

            {isAvailable && (
              <span>
                {product.quantity} available
              </span>
            )}
          </div>

          {isAvailable && (
            <div className="product-details__cart">
              <div className="product-details__quantity">
                <label htmlFor="cart-quantity">
                  Quantity
                </label>

                <input
                  id="cart-quantity"
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={cartQuantity}
                  onChange={handleQuantityChange}
                />
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="product-details__add-cart"
              >
                {addingToCart
                  ? "Adding..."
                  : "Add to Cart"}
              </button>

              {cartMessage && (
                <p className="product-details__cart-success">
                  {cartMessage}
                </p>
              )}

              {cartError && (
                <p className="product-details__cart-error">
                  {cartError}
                </p>
              )}
            </div>
          )}

          <div className="product-details__section">
            <h2>Description</h2>

            <p>
              {product.description ||
                "No description available."}
            </p>
          </div>

          <div className="product-details__section">
            <h2>Product Information</h2>

            <dl className="product-details__info">
              <div>
                <dt>Category</dt>

                <dd>
                  {product.category?.name ||
                    "Uncategorized"}
                </dd>
              </div>

              <div>
                <dt>Seller</dt>

                <dd>
                  {product.seller?.name ||
                    "Unknown seller"}
                </dd>
              </div>

              <div>
                <dt>Status</dt>

                <dd>{product.status}</dd>
              </div>

              <div>
                <dt>Availability</dt>

                <dd>
                  {isAvailable
                    ? "Available"
                    : "Out of stock"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetailsPage;