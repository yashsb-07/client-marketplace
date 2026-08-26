import { useEffect, useState } from "react";

import {
  createSellerProduct,
  getSellerProductById,
  getSellerProducts,
  updateSellerProduct,
} from "../services/sellerProductService";

import "./SellerProductsPage.css";

export default function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    imageUrl: "",
  });

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSellerProducts();

        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Seller products request failed:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.message || "Unable to load your products.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const price = Number(form.price);
    const quantity = Number(form.quantity);
    const categoryId = Number(form.categoryId);

    if (form.name.trim().length < 2) {
      setError("Product name must be at least 2 characters.");
      return;
    }

    if (form.description.trim().length < 10) {
      setError("Product description must be at least 10 characters.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      setError("Quantity must be a non-negative whole number.");
      return;
    }

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      setError("Please enter a valid category ID.");
      return;
    }

    try {
      setSaving(true);

      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        quantity,
        categoryId,
      };

      if (form.imageUrl.trim()) {
        productData.imageUrl = form.imageUrl.trim();
      }

      if (editingProductId) {
        const updatedProduct = await updateSellerProduct(
          editingProductId,
          productData,
        );

        setProducts((current) =>
          current.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product,
          ),
        );

        setEditingProductId(null);

        setForm({
          name: "",
          description: "",
          price: "",
          quantity: "",
          categoryId: "",
          imageUrl: "",
        });

        setSuccess("Product updated successfully.");
      } else {
        const createdProduct = await createSellerProduct(productData);

        setProducts((current) => [createdProduct, ...current]);

        setForm({
          name: "",
          description: "",
          price: "",
          quantity: "",
          categoryId: "",
          imageUrl: "",
        });

        setSuccess("Product created successfully.");
      }
      
    } catch (err) {
      console.error("Create product failed:", err);

      setError(err.response?.data?.message || "Unable to create the product.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (productId) => {
    try {
      setError("");
      setSuccess("");
      setLoadingProduct(true);

      const product = await getSellerProductById(productId);

      setEditingProductId(product.id);

      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price ?? "",
        quantity: product.quantity ?? "",
        categoryId: product.categoryId ?? "",
        imageUrl: product.imageUrl || "",
      });
    } catch (err) {
      console.error("Load seller product failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load the product for editing.",
      );
    } finally {
      setLoadingProduct(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);

    setForm({
      name: "",
      description: "",
      price: "",
      quantity: "",
      categoryId: "",
      imageUrl: "",
    });

    setError("");
    setSuccess("");
  };

  return (
    <main className="seller-products-page">
      <section className="seller-products-header">
        <div>
          <h1>My Products</h1>
          <p>Manage the products you have created.</p>
        </div>
      </section>

      {error && <div className="seller-products-message error">{error}</div>}

      {success && (
        <div className="seller-products-message success">{success}</div>
      )}

      <section className="seller-product-create-section">
        <h2>{editingProductId ? "Edit Product" : "Add Product"}</h2>

        <form className="seller-product-form" onSubmit={handleSubmit}>
          <label>
            Product Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              maxLength={150}
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
              maxLength={5000}
              rows={5}
            />
          </label>

          <div className="seller-product-form-grid">
            <label>
              Price
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </label>

            <label>
              Quantity
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                min="0"
                step="1"
              />
            </label>

            <label>
              Category ID
              <input
                type="number"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                min="1"
                step="1"
              />
            </label>

            <label>
              Image URL
              <input
                type="url"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </label>
          </div>

          <button type="submit" disabled={saving}>
            {saving
              ? editingProductId
                ? "Updating..."
                : "Creating..."
              : editingProductId
                ? "Update Product"
                : "Create Product"}
          </button>

          {editingProductId && (
            <button
              type="button"
              className="seller-product-cancel-button"
              onClick={handleCancelEdit}
              disabled={saving}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </section>

      <section className="seller-product-list-section">
        <div className="seller-product-list-header">
          <h2>My Products</h2>
          <span>
            {products.length} product
            {products.length === 1 ? "" : "s"}
          </span>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <div className="seller-products-empty">
            <p>You haven't created any products yet.</p>
          </div>
        ) : (
          <div className="seller-products-grid">
            {products.map((product) => (
              <article className="seller-product-card" key={product.id}>
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} />
                )}

                <div className="seller-product-card-content">
                  <h3>{product.name}</h3>

                  <p>{product.description}</p>

                  <div className="seller-product-card-meta">
                    <span>Price: ₹{product.price}</span>

                    <span>Quantity: {product.quantity}</span>
                  </div>

                  {product.category && (
                    <span>Category: {product.category.name}</span>
                  )}

                  <button
                    type="button"
                    className="seller-product-edit-button"
                    onClick={() => handleEdit(product.id)}
                    disabled={loadingProduct}
                  >
                    {loadingProduct && editingProductId === product.id
                      ? "Loading..."
                      : "Edit Product"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
