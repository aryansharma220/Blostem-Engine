import products from "../data/products.json" with { type: "json" };

export function getAllProducts() {
  return products;
}

export function getProductById(productId) {
  return products.find((product) => product.id === productId) || null;
}
