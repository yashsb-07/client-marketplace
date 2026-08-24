import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getMarketplaceProducts } from "../services/marketplaceService";

function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async (page = 1) => {
    try {
        setLoading(true);
        setError("");

        const data = await getMarketplaceProducts({
        page,
        limit: 12,
        });

        setProducts(data.products);
        setPagination(data.pagination);
    } catch (err) {
        console.error("Marketplace request failed:", err);

        setError(
        "Unable to load marketplace products. Please try again."
        );
    } finally {
        setLoading(false);
    }
    };

    useEffect(() => {
    let cancelled = false;

    const fetchInitialProducts = async () => {
        try {
        const data = await getMarketplaceProducts({
            page: 1,
            limit: 12,
        });

        if (cancelled) {
            return;
        }

        setProducts(data.products);
        setPagination(data.pagination);
        } catch (err) {
        if (cancelled) {
            return;
        }

        console.error("Marketplace request failed:", err);

        setError(
            "Unable to load marketplace products. Please try again."
        );
        } finally {
        if (!cancelled) {
            setLoading(false);
        }
        }
    };

    fetchInitialProducts();

    return () => {
        cancelled = true;
    };
    }, []);

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > pagination.totalPages ||
      page === pagination.page
    ) {
      return;
    }

    loadProducts(page);
  };

  return (
    <main className="marketplace-page">
      <section className="marketplace-header">
        <div>
          <p className="marketplace-eyebrow">
            CLIENT MARKETPLACE
          </p>

          <h1>Explore Products</h1>

          <p className="marketplace-description">
            Discover products from our marketplace sellers.
          </p>
        </div>

        {!loading && !error && pagination.total > 0 && (
          <p className="marketplace-count">
            {pagination.total} product
            {pagination.total !== 1 ? "s" : ""}
          </p>
        )}
      </section>

      {loading && (
        <section className="marketplace-state">
          <div className="loading-spinner" />
          <p>Loading products...</p>
        </section>
      )}

      {!loading && error && (
        <section className="marketplace-state marketplace-state--error">
          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => loadProducts(pagination.page)}
          >
            Try Again
          </button>
        </section>
      )}

      {!loading && !error && products.length === 0 && (
        <section className="marketplace-state">
          <h2>No products available</h2>

          <p>
            There are currently no products available in the
            marketplace.
          </p>
        </section>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <section className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </section>

          {pagination.totalPages > 1 && (
            <nav
              className="pagination"
              aria-label="Marketplace pagination"
            >
              <button
                type="button"
                onClick={() =>
                  handlePageChange(pagination.page - 1)
                }
                disabled={pagination.page === 1}
              >
                Previous
              </button>

              <span>
                Page {pagination.page} of{" "}
                {pagination.totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  handlePageChange(pagination.page + 1)
                }
                disabled={
                  pagination.page === pagination.totalPages
                }
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
}

export default MarketplacePage;