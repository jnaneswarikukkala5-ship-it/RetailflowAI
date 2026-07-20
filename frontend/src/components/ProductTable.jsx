import React from "react";
import { FiEdit3, FiEye, FiTrash2 } from "react-icons/fi";

function ProductTable({ products, onView, onEdit, onDelete }) {
  return (
    <section className="table-card card-glass">
      <div className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Catalog</p>
          <h3>Product Table</h3>
        </div>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const status = product.stock > 40 ? "Healthy" : product.stock > 15 ? "Monitor" : "Low";

              return (
                <tr key={product.id}>
                  <td>{product.sku}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status-pill status-pill--${status.toLowerCase()}`}>{status}</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button type="button" className="icon-button icon-button--sm" onClick={() => onView(product)}>
                        <FiEye />
                      </button>
                      <button type="button" className="icon-button icon-button--sm" onClick={() => onEdit(product)}>
                        <FiEdit3 />
                      </button>
                      <button type="button" className="icon-button icon-button--sm icon-button--danger" onClick={() => onDelete(product.id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ProductTable;