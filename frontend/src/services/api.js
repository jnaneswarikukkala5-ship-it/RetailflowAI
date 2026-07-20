const BASE_URL = localStorage.getItem("custom_api_url") || "http://localhost:5000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || data.error || `HTTP ${response.status} Error`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await handleResponse(res);
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return data;
    },
    register: async (name, email, password, role = "staff") => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await handleResponse(res);
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return data;
    },
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    getUser: () => {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
  },
  products: {
    list: async () => {
      const res = await fetch(`${BASE_URL}/products`, { headers: getHeaders() });
      return handleResponse(res);
    },
    get: async (id) => {
      const res = await fetch(`${BASE_URL}/products/${id}`, { headers: getHeaders() });
      return handleResponse(res);
    },
    create: async (payload) => {
      const res = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    update: async (id, payload) => {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  },
  inventory: {
    list: async () => {
      const res = await fetch(`${BASE_URL}/inventory`, { headers: getHeaders() });
      return handleResponse(res);
    },
    get: async (id) => {
      const res = await fetch(`${BASE_URL}/inventory/${id}`, { headers: getHeaders() });
      return handleResponse(res);
    },
    create: async (payload) => {
      const res = await fetch(`${BASE_URL}/inventory`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    update: async (id, payload) => {
      const res = await fetch(`${BASE_URL}/inventory/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/inventory/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  },
  sales: {
    list: async () => {
      const res = await fetch(`${BASE_URL}/sales`, { headers: getHeaders() });
      return handleResponse(res);
    },
    create: async (payload) => {
      const res = await fetch(`${BASE_URL}/sales`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    report: async () => {
      const res = await fetch(`${BASE_URL}/sales/report`, { headers: getHeaders() });
      return handleResponse(res);
    }
  },
  analytics: {
    dashboard: async () => {
      const res = await fetch(`${BASE_URL}/analytics/dashboard`, { headers: getHeaders() });
      return handleResponse(res);
    },
    revenue: async () => {
      const res = await fetch(`${BASE_URL}/analytics/revenue`, { headers: getHeaders() });
      return handleResponse(res);
    },
    topProducts: async () => {
      const res = await fetch(`${BASE_URL}/analytics/top-products`, { headers: getHeaders() });
      return handleResponse(res);
    },
    monthlySales: async () => {
      const res = await fetch(`${BASE_URL}/analytics/monthly-sales`, { headers: getHeaders() });
      return handleResponse(res);
    }
  },
  ai: {
    predict: async (productId) => {
      const res = await fetch(`${BASE_URL}/ai/predict-demand`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ product_id: productId }),
      });
      return handleResponse(res);
    },
    restock: async () => {
      const res = await fetch(`${BASE_URL}/ai/restock`, { headers: getHeaders() });
      return handleResponse(res);
    },
    recommendations: async () => {
      const res = await fetch(`${BASE_URL}/ai/recommendations`, { headers: getHeaders() });
      return handleResponse(res);
    }
  }
};
