import React from "react";
import { FiEdit3, FiEye, FiTrash2 } from "react-icons/fi";

function ProductCard({ product, onView, onEdit, onDelete }) {
  const stockLevel = product.stock > 40 ? "Healthy" : product.stock > 15 ? "Monitor" : "Low";

  return (
    <article className="product-card card-glass">
      <div className="product-card__image">{product.name.slice(0, 1)}</div>
      <div className="product-card__body">
        <div className="product-card__meta">
          <span>{product.category}</span>
          <span className={`status-pill status-pill--${stockLevel.toLowerCase()}`}>{stockLevel}</span>
        </div>
        <h4>{product.name}</h4>
        <p>{product.description}</p>
        <strong>${product.price.toFixed(2)}</strong>
        <div className="product-card__actions">
          <button type="button" className="secondary-button" onClick={() => onView(product)}>
            <FiEye /> View
          </button>
          <button type="button" className="secondary-button" onClick={() => onEdit(product)}>
            <FiEdit3 /> Edit
          </button>
          <button type="button" className="danger-button" onClick={() => onDelete(product.id)}>
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;