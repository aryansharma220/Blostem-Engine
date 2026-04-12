const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export async function getProducts() {
  const response = await fetch(`${API_BASE}/products`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function getRecommendations(userProfile) {
  const response = await fetch(`${API_BASE}/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userProfile }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.details || "Failed to generate recommendations");
  }

  return data;
}
