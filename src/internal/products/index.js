import { get, post } from "../request"

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
    data: data,
  })
}

function getProductsByCollections(data) {
  return post("products/collections", {
    data: data,
  })
}

export {
  getAllTags,
  getAllVendors,
  getAllTypes,
  getProducts,
  getProductsByCollections,
}
