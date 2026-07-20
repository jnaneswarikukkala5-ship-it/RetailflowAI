import React, { useState } from "react";
import { FiFilter, FiPlus, FiSearch } from "react-icons/fi";

import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import ProductTable from "../components/ProductTable";
import { productCategories, products as initialProducts } from "../data/mockData";

function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [modalMode, setModalMode] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = [product.name, product.category, product.sku].some((value) => value.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleSave = (updatedProduct) => {
    setProducts((current) => {
      const exists = current.some((item) => item.id === updatedProduct.id);
      if (exists) {
        return current.map((item) => (item.id === updatedProduct.id ? updatedProduct : item));
      }
      return [updatedProduct, ...current];
    });
    setModalMode(null);
    setActiveProduct(null);
  };

  const handleDelete = (id) => setProducts((current) => current.filter((item) => item.id !== id));

  return (
    <div className="page-stack">
      <section className="toolbar card-glass">
        <label className="toolbar__search">
          <FiSearch />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products, SKUs, or categories" />
        </label>

        <label className="toolbar__select">
          <FiFilter />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {productCategories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>

        <button className="primary-button" type="button" onClick={() => { setActiveProduct(null); setModalMode("add"); }}>
          <FiPlus /> Add Product
        </button>
      </section>

      <section className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onView={(item) => { setActiveProduct(item); setModalMode("details"); }}
            onEdit={(item) => { setActiveProduct(item); setModalMode("edit"); }}
            onDelete={handleDelete}
          />
        ))}
      </section>

      <ProductTable
        products={filteredProducts}
        onView={(item) => { setActiveProduct(item); setModalMode("details"); }}
        onEdit={(item) => { setActiveProduct(item); setModalMode("edit"); }}
        onDelete={handleDelete}
      />

      <ProductModal
        isOpen={Boolean(modalMode)}
        mode={modalMode}
        product={activeProduct}
        onClose={() => { setModalMode(null); setActiveProduct(null); }}
        onSave={handleSave}
      />
    </div>
  );
}

export default Products;