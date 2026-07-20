import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

const emptyProduct = {
  name: "",
  category: "Electronics",
  price: "",
  stock: "",
  sku: "",
  description: "",
};

function ProductModal({ isOpen, mode, product, onClose, onSave }) {
  const [form, setForm] = useState(emptyProduct);

  useEffect(() => {
    if (product && mode !== "add") {
      setForm({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        sku: product.sku,
        description: product.description,
      });
    } else {
      setForm(emptyProduct);
    }
  }, [mode, product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      id: product?.id ?? Date.now(),
      name: form.name,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      sku: form.sku,
      description: form.description,
    });
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Product details modal">
      <div className="modal card-glass">
        <div className="modal__header">
          <div>
            <p className="section-heading__eyebrow">Product details</p>
            <h3>{mode === "details" ? product.name : mode === "edit" ? "Edit Product" : "Add Product"}</h3>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>

        {mode === "details" ? (
          <div className="modal__details">
            <div><span>SKU</span><strong>{product.sku}</strong></div>
            <div><span>Category</span><strong>{product.category}</strong></div>
            <div><span>Price</span><strong>${product.price.toFixed(2)}</strong></div>
            <div><span>Stock</span><strong>{product.stock}</strong></div>
            <div><span>Description</span><strong>{product.description}</strong></div>
          </div>
        ) : (
          <form className="modal__form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Product Name
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label>
                Category
                <input name="category" value={form.category} onChange={handleChange} required />
              </label>
              <label>
                Price
                <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required />
              </label>
              <label>
                Stock
                <input name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange} required />
              </label>
              <label>
                SKU
                <input name="sku" value={form.sku} onChange={handleChange} required />
              </label>
              <label className="form-grid__full">
                Description
                <textarea name="description" rows="4" value={form.description} onChange={handleChange} required />
              </label>
            </div>
            <div className="modal__actions">
              <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
              <button type="submit" className="primary-button">Save Product</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProductModal;