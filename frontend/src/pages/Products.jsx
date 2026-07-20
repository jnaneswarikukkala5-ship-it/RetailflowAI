import React, { useState, useEffect } from "react";
import { FiFilter, FiPlus, FiSearch } from "react-icons/fi";

import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import ProductTable from "../components/ProductTable";
import { api } from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [modalMode, setModalMode] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      const [productsRes, inventoryRes] = await Promise.all([
        api.products.list(),
        api.inventory.list(),
      ]);
      
      const invMap = {};
      (inventoryRes.items || []).forEach(item => {
        invMap[item.product_id] = item.quantity;
      });

      const mappedProducts = (productsRes.items || []).map(p => ({
        id: p.id,
        name: p.product_name,
        category: p.category,
        price: p.price,
        sku: p.barcode,
        description: p.description,
        stock: invMap[p.id] || 0
      }));

      setProducts(mappedProducts);

      // Extract unique categories
      const allCategories = ["All", ...new Set(mappedProducts.map(p => p.category))];
      setCategories(allCategories);
    } catch (err) {
      setError(err.message || "Failed to load products list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = [product.name, product.category, product.sku].some((value) => 
      (value || "").toLowerCase().includes(search.toLowerCase())
    );
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleSave = async (updatedProduct) => {
    try {
      const payload = {
        product_name: updatedProduct.name,
        category: updatedProduct.category,
        price: updatedProduct.price,
        barcode: updatedProduct.sku,
        description: updatedProduct.description
      };
      
      if (activeProduct && modalMode === "edit") {
        await api.products.update(activeProduct.id, payload);
        // If stock level has changed, also update inventory
        if (updatedProduct.stock !== activeProduct.stock) {
          const invList = await api.inventory.list();
          const record = (invList.items || []).find(item => item.product_id === activeProduct.id);
          if (record) {
            await api.inventory.update(record.id, { quantity: updatedProduct.stock });
          }
        }
      } else {
        const res = await api.products.create(payload);
        const newItem = res.item;
        // Auto create inventory record for new product
        await api.inventory.create({
          product_id: newItem.id,
          quantity: updatedProduct.stock || 0,
          reorder_level: Math.max(1, Math.floor((updatedProduct.stock || 0) / 2)),
          warehouse_location: "General Warehouse"
        });
      }
      setModalMode(null);
      setActiveProduct(null);
      loadAllProducts();
    } catch (err) {
      alert(err.message || "Error saving product changes");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const invList = await api.inventory.list();
        const record = (invList.items || []).find(item => item.product_id === id);
        if (record) {
          await api.inventory.delete(record.id);
        }
        await api.products.delete(id);
        loadAllProducts();
      } catch (err) {
        alert(err.message || "Error deleting product");
      }
    }
  };

  if (loading && products.length === 0) return <div className="card-glass" style={{ padding: "2rem", textAlign: "center" }}>Loading Catalog...</div>;
  if (error) return <div className="card-glass" style={{ padding: "2rem", textAlign: "center", color: "#ef4444" }}>Error: {error}</div>;

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
            {categories.map((item) => <option key={item}>{item}</option>)}
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