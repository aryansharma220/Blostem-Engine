import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const products = require("../data/products.json");

export function getAllProducts() {
  return products;
}

export function getProductById(productId) {
  return products.find((product) => product.id === productId) || null;
}
