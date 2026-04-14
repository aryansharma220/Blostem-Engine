import { getAllProducts } from "../server/services/productService.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.json({ products: getAllProducts() });
}