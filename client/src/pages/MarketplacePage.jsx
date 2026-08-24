import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getMarketplaceProducts } from "../services/marketplaceService";

const DEFAULT_FILTERS = {
  search: "",
  categoryId: "",
  minPrice: "",
  maxPrice: "",
  available: "",
  sort: "",
};

function MarketplacePage() {
  const [products, setProducts] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState(DEFAULT_FILTERS);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async (
    page = 1,
    activeFilters = appliedFilters
  ) => {
    try {
      setLoading(true);
      setError("");

      const data = await getMarketplaceProducts({
        page,
        limit: 12,
        ...activeFilters,
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

  const categories = useMemo(() => {
    const categoryMap = new Map();

    products.forEach((product) => {
      if (product.category?.id && product.category?.name) {
        categoryMap.set(
          product.category.id,
          product.category.name
        );
      }
    });

    return Array.from(categoryMap.entries()).sort((a, b) =>
      a[1].localeCompare(b[1])
    );
  }, [products]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();

    if (
      filters.minPrice !== "" &&
      filters.maxPrice !== "" &&
      Number(filters.minPrice) > Number(filters.maxPrice)
    ) {
      setError(
        "Minimum price cannot be greater than maximum price."
      );

      return;
    }

    setError("");
    setAppliedFilters(filters);
    loadProducts(1, filters);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    loadProducts(1, DEFAULT_FILTERS);
  };

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > pagination.totalPages ||
      page === pagination.page
    ) {
      return;
    }

    loadProducts(page, appliedFilters);
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

      <section className="marketplace-filters">
        <form
          className="filter-form"
          onSubmit={handleApplyFilters}
        >
          <div className="filter-field filter-field--search">
            <label htmlFor="search">
              Search
            </label>

            <input
              id="search"
              name="search"
              type="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search products..."
            />
          </div>

          <div className="filter-field">
            <label htmlFor="categoryId">
              Category
            </label>

            <select
              id="categoryId"
              name="categoryId"
              value={filters.categoryId}
              onChange={handleFilterChange}
            >
              <option value="">
                All categories
              </option>

              {categories.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="minPrice">
              Min price
            </label>

            <input
              id="minPrice"
              name="minPrice"
              type="number"
              min="0"
              step="0.01"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="0"
            />
          </div>

          <div className="filter-field">
            <label htmlFor="maxPrice">
              Max price
            </label>

            <input
              id="maxPrice"
              name="maxPrice"
              type="number"
              min="0"
              step="0.01"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Any"
            />
          </div>

          <div className="filter-field">
            <label htmlFor="available">
              Availability
            </label>

            <select
              id="available"
              name="available"
              value={filters.available}
              onChange={handleFilterChange}
            >
              <option value="">
                All products
              </option>

              <option value="true">
                In stock
              </option>

              <option value="false">
                Out of stock
              </option>
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="sort">
              Sort by
            </label>

            <select
              id="sort"
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
            >
              <option value="">
                Default
              </option>

              <option value="newest">
                Newest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="price_asc">
                Price: Low to High
              </option>

              <option value="price_desc">
                Price: High to Low
              </option>
            </select>
          </div>

          <div className="filter-actions">
            <button
              type="submit"
              className="filter-button filter-button--primary"
            >
              Apply Filters
            </button>

            <button
              type="button"
              className="filter-button"
              onClick={handleClearFilters}
            >
              Clear
            </button>
          </div>
        </form>
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
            onClick={() =>
              loadProducts(
                pagination.page,
                appliedFilters
              )
            }
          >
            Try Again
          </button>
        </section>
      )}

      {!loading && !error && products.length === 0 && (
        <section className="marketplace-state">
          <h2>No products found</h2>

          <p>
            Try changing your search or filter options.
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
                  handlePageChange(
                    pagination.page - 1
                  )
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
                  handlePageChange(
                    pagination.page + 1
                  )
                }
                disabled={
                  pagination.page ===
                  pagination.totalPages
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