import { get, post } from "../request"

function jsF(d) {
  return wp.hooks.applyFilters("product.requestSettings", d)
}

function getAllTags() {
  return get("products/tags")
}

function getAllVendors() {
  return get("products/vendors")
}

function getAllTypes() {
  return get("products/types")
}

function getProducts(data) {
  return post("products", {
    data: jsF(data),
  })
}

function getProductsByCollections(data) {
  return post("products/collections", {
    data: jsF(data),
  })
}

export {
  getAllTags,
  getAllVendors,
  getAllTypes,
  getProducts,
  getProductsByCollections,
}
