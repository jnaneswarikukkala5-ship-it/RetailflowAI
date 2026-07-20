// Centralized mock data keeps the dashboard consistent across every page.
export const dashboardStats = [
  { label: "Total Products", value: "1,248", change: "+8.4% this month", tone: "blue" },
  { label: "Revenue", value: "$248.6K", change: "+12.1% this month", tone: "navy" },
  { label: "Sales", value: "8,924", change: "+5.7% this week", tone: "sky" },
  { label: "Low Stock Alerts", value: "14", change: "Needs restocking", tone: "amber" },
];

export const recentOrders = [
  { id: "RF-1001", customer: "Ava Martinez", item: "Wireless Headphones", amount: "$189", status: "Shipped" },
  { id: "RF-1002", customer: "Noah Lee", item: "Smart Speaker", amount: "$129", status: "Packed" },
  { id: "RF-1003", customer: "Olivia Chen", item: "4K Monitor", amount: "$399", status: "Processing" },
  { id: "RF-1004", customer: "Mason Brown", item: "Gaming Mouse", amount: "$69", status: "Delivered" },
];

export const recentActivities = [
  { text: "Warehouse West received 220 new units of accessories.", time: "12 min ago" },
  { text: "AI forecast triggered a restock alert for laptop bags.", time: "38 min ago" },
  { text: "Revenue dashboard updated with overnight POS data.", time: "1 hour ago" },
  { text: "New supplier pricing was approved for seasonal items.", time: "2 hours ago" },
];

export const inventoryItems = [
  { sku: "PRD-001", name: "Wireless Headphones", warehouse: "North Hub", stock: 74, min: 40, status: "Healthy" },
  { sku: "PRD-002", name: "Laptop Stand", warehouse: "West Hub", stock: 28, min: 35, status: "Low" },
  { sku: "PRD-003", name: "Bluetooth Speaker", warehouse: "South Hub", stock: 56, min: 30, status: "Healthy" },
  { sku: "PRD-004", name: "Smartwatch", warehouse: "East Hub", stock: 12, min: 25, status: "Critical" },
];

export const lowStockAlerts = [
  "Smartwatch stock will run out in 6 days.",
  "Laptop Stand demand is 24% above the monthly trend.",
  "Headphone cushions should be restocked before weekend traffic.",
];

export const products = [
  { id: 1, name: "Premium Headphones", category: "Electronics", price: 129, stock: 74, sku: "PRD-001", description: "Noise cancelling over-ear headphones with long battery life." },
  { id: 2, name: "Office Chair", category: "Furniture", price: 249, stock: 21, sku: "PRD-002", description: "Ergonomic chair with lumbar support and breathable mesh." },
  { id: 3, name: "Smart Speaker", category: "Electronics", price: 89, stock: 45, sku: "PRD-003", description: "Voice-controlled speaker for connected retail spaces." },
  { id: 4, name: "Travel Backpack", category: "Accessories", price: 59, stock: 18, sku: "PRD-004", description: "Water-resistant backpack with laptop compartment." },
  { id: 5, name: "Desk Lamp", category: "Home", price: 39, stock: 62, sku: "PRD-005", description: "LED lamp with adjustable brightness and warm mode." },
  { id: 6, name: "Gaming Mouse", category: "Electronics", price: 49, stock: 9, sku: "PRD-006", description: "High DPI mouse with programmable side buttons." },
];

export const aiInsights = [
  { title: "Demand Prediction", text: "Accessories will peak next week with a forecast uplift of 16%.", emphasis: "high" },
  { title: "Restock Suggestions", text: "Reorder Smartwatch units and Travel Backpacks before Friday.", emphasis: "medium" },
  { title: "Inventory Optimization", text: "Move 30 units from West Hub to South Hub to balance supply.", emphasis: "low" },
];

export const bestSellers = [
  { name: "Premium Headphones", sales: 184 },
  { name: "Desk Lamp", sales: 152 },
  { name: "Smart Speaker", sales: 131 },
  { name: "Gaming Mouse", sales: 109 },
];

export const monthlySalesReport = [
  { month: "Jan", sales: 48, revenue: 32, profit: 18 },
  { month: "Feb", sales: 52, revenue: 35, profit: 21 },
  { month: "Mar", sales: 58, revenue: 39, profit: 24 },
  { month: "Apr", sales: 61, revenue: 43, profit: 26 },
  { month: "May", sales: 67, revenue: 46, profit: 29 },
  { month: "Jun", sales: 74, revenue: 51, profit: 33 },
];

export const weeklySalesReport = [
  { label: "Mon", value: 12.4 },
  { label: "Tue", value: 14.2 },
  { label: "Wed", value: 15.8 },
  { label: "Thu", value: 13.6 },
  { label: "Fri", value: 18.1 },
  { label: "Sat", value: 19.4 },
  { label: "Sun", value: 11.9 },
];

export const futureTrend = [
  { month: "Jul", value: 80 },
  { month: "Aug", value: 88 },
  { month: "Sep", value: 94 },
  { month: "Oct", value: 103 },
  { month: "Nov", value: 111 },
  { month: "Dec", value: 124 },
];

export const productCategories = ["All", "Electronics", "Furniture", "Accessories", "Home"];