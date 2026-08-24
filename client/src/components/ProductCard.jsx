function ProductCard({ product }) {
  const isAvailable = product.quantity > 0;

  return (
    <article className="product-card">
      <div className="product-card__image-wrapper">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-card__image"
          />
        ) : (
          <div className="product-card__image-placeholder">
            No image available
          </div>
        )}
      </div>

      <div className="product-card__content">
        <p className="product-card__category">
          {product.category?.name || "Uncategorized"}
        </p>

        <h2 className="product-card__name">
          {product.name}
        </h2>

        <p className="product-card__seller">
          Sold by {product.seller?.name || "Unknown seller"}
        </p>

        <div className="product-card__footer">
          <p className="product-card__price">
            ₹{Number(product.price).toFixed(2)}
          </p>

          <span
            className={`product-card__availability ${
              isAvailable
                ? "product-card__availability--available"
                : "product-card__availability--out"
            }`}
          >
            {isAvailable ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;